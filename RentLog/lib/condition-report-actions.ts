"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";
import { createConditionReport } from "@/lib/condition-reports";
import { deleteConditionPhotos, isPhotoStorageConfigured, uploadConditionPhoto } from "@/lib/photo-storage";
import {
    MAX_TOTAL_PHOTO_BYTES,
    ROOM_OPTIONS,
    checkRoomPhotos,
    formatBytes,
} from "@/lib/upload-rules";
import type { ConditionReportFormState } from "@/lib/condition-report-form";
import type { ObservationDoc } from "@/models/ConditionReport";

const CONDITIONS = ["excellent", "good", "fair", "poor", "damaged"] as const;

const ReportSchema = z.object({
    type: z.enum(["move-in", "move-out"], { error: "Choose move-in or move-out." }),
    reportDate: z.iso
        .date({ error: "Enter the date of the walkthrough.", abort: true })
        .refine((value) => new Date(`${value}T00:00:00Z`) <= new Date(), {
            error: "The walkthrough date can't be in the future.",
        }),
});

const RoomSchema = z.object({
    condition: z.enum(CONDITIONS, { error: "Choose a condition." }),
    notes: z.string().trim().max(1000, { error: "Keep notes under 1,000 characters." }),
    name: z.string().trim().min(1, { error: "Enter the room name." }).max(80, { error: "Keep the room name under 80 characters." }),
});

/** Text fields, returned with errors so the form keeps what the user typed. */
function readText(formData: FormData): Record<string, string> {
    const values: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
        if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
    }
    return values;
}

/** Real files only: an empty file input still sends one nameless, zero-byte entry. */
function readFiles(formData: FormData, name: string): File[] {
    return formData
        .getAll(name)
        .filter((entry): entry is File => entry instanceof File && entry.size > 0 && entry.name !== "");
}

interface CheckedRoom {
    name: string;
    condition: ObservationDoc["condition"];
    notes: string;
    photos: File[];
}

export async function createConditionReportAction(
    propertyId: string,
    _prevState: ConditionReportFormState,
    formData: FormData
): Promise<ConditionReportFormState> {
    const values = readText(formData);
    const errors: Record<string, string[]> = {};
    const fail = (message: string): ConditionReportFormState => ({ message, errors, values });

    // The property must exist and belong to this user (same rule as the API).
    if (!/^[a-f0-9]{24}$/i.test(propertyId)) return fail("That property doesn't exist.");
    const userId = await getCurrentUserId();
    const property = await getPropertyById(userId, propertyId);
    if (!property) return fail("That property doesn't exist.");

    // ---- Report details ----
    const report = ReportSchema.safeParse({ type: values.type ?? "", reportDate: values.reportDate ?? "" });
    if (!report.success) Object.assign(errors, z.flattenError(report.error).fieldErrors);

    // ---- Room checklist ----
    const rooms: CheckedRoom[] = [];
    let totalBytes = 0;

    for (const option of ROOM_OPTIONS) {
        const prefix = `room-${option.key}`;
        if (values[`${prefix}-include`] !== "on") continue;

        const photos = readFiles(formData, `${prefix}-photos`);
        const parsed = RoomSchema.safeParse({
            condition: values[`${prefix}-condition`] ?? "",
            notes: values[`${prefix}-notes`] ?? "",
            name: option.key === "other" ? (values[`${prefix}-name`] ?? "") : option.label,
        });

        if (!parsed.success) {
            const fieldErrors = z.flattenError(parsed.error).fieldErrors;
            if (fieldErrors.condition) errors[`${prefix}-condition`] = fieldErrors.condition;
            if (fieldErrors.notes) errors[`${prefix}-notes`] = fieldErrors.notes;
            if (fieldErrors.name) errors[`${prefix}-name`] = fieldErrors.name;
        }

        const photoProblems = checkRoomPhotos(photos);
        if (photoProblems.length > 0) errors[`${prefix}-photos`] = photoProblems;

        totalBytes += photos.reduce((sum, file) => sum + file.size, 0);
        if (parsed.success) rooms.push({ ...parsed.data, photos });
    }

    const checkedCount = ROOM_OPTIONS.filter((o) => values[`room-${o.key}-include`] === "on").length;
    if (checkedCount === 0) errors.rooms = ["Tick at least one room to include in the report."];
    if (totalBytes > MAX_TOTAL_PHOTO_BYTES) {
        errors.rooms = [
            ...(errors.rooms ?? []),
            `Your photos add up to ${formatBytes(totalBytes)}; the limit is ${formatBytes(MAX_TOTAL_PHOTO_BYTES)} per report. Remove some photos or use smaller ones.`,
        ];
    }

    const hasPhotos = rooms.some((room) => room.photos.length > 0);
    if (hasPhotos && !isPhotoStorageConfigured()) {
        errors.rooms = [
            ...(errors.rooms ?? []),
            "Photo uploads aren't set up on this site yet. Remove the photos to save the report without them.",
        ];
    }

    if (Object.keys(errors).length > 0 || !report.success) {
        return fail("Please fix the highlighted fields and try again.");
    }

    // ---- Upload photos (only after everything else is valid) ----
    const uploaded: string[] = [];
    const observations: ObservationDoc[] = [];

    for (const room of rooms) {
        const photoUrls: string[] = [];
        for (const photo of room.photos) {
            try {
                const url = await uploadConditionPhoto(photo, { userId, propertyId, room: room.name });
                uploaded.push(url);
                photoUrls.push(url);
            } catch (error) {
                console.error("Photo upload failed:", error);
                await deleteConditionPhotos(uploaded);
                const key = ROOM_OPTIONS.find((o) => o.label === room.name)?.key ?? "other";
                errors[`room-${key}-photos`] = [`"${photo.name}" couldn't be uploaded. Check your connection and try again.`];
                return fail("A photo failed to upload, so the report wasn't saved. Please try again.");
            }
        }
        observations.push({
            room: room.name,
            condition: room.condition,
            notes: room.notes || undefined,
            photoUrls,
        });
    }

    // ---- Save ----
    try {
        await createConditionReport(userId, propertyId, {
            type: report.data.type,
            reportDate: new Date(`${report.data.reportDate}T00:00:00Z`),
            observations,
        });
    } catch (error) {
        console.error("createConditionReport failed:", error);
        await deleteConditionPhotos(uploaded);
        return fail("The report couldn't be saved. Please try again in a moment.");
    }

    // Outside try/catch: redirect() works by throwing.
    revalidatePath(`/properties/${propertyId}/condition`);
    redirect(`/properties/${propertyId}/condition`);
}
