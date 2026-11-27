"use client";

import { startTransition, useActionState, useId, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
    initialConditionReportFormState,
    type ConditionReportFormState,
} from "@/lib/condition-report-form";
import {
    ALLOWED_PHOTO_LABEL,
    ALLOWED_PHOTO_TYPES,
    MAX_PHOTOS_PER_ROOM,
    MAX_PHOTO_BYTES,
    MAX_TOTAL_PHOTO_BYTES,
    ROOM_OPTIONS,
    checkRoomPhotos,
    formatBytes,
    type RoomKey,
} from "@/lib/upload-rules";

type FormAction = (state: ConditionReportFormState, formData: FormData) => Promise<ConditionReportFormState>;

interface ConditionReportFormProps {
    action: FormAction;
    propertyId: string;
}

const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 aria-[invalid=true]:border-red-700";
const labelClass = "mb-1 block text-sm font-semibold text-stone-800";

const CONDITIONS = [
    { value: "excellent", label: "Excellent" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
    { value: "damaged", label: "Damaged" },
];

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

/**
 * New condition report: report type and date, then an interactive room checklist.
 * Ticking a room reveals its condition, notes and photo fields. Photos are checked in the
 * browser for instant feedback, then again on the server, which is the real check.
 */
export default function ConditionReportForm({ action, propertyId }: ConditionReportFormProps) {
    const [state, formAction, isPending] = useActionState(action, initialConditionReportFormState);
    const values = state.values ?? {};
    const errors = state.errors;

    // Unique ids: Next.js keeps recently visited pages mounted (hidden), so fixed ids could repeat.
    const uid = useId();
    const fid = (name: string) => `${uid}-${name}`;

    const [included, setIncluded] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(ROOM_OPTIONS.map((o) => [o.key, values[`room-${o.key}-include`] === "on"]))
    );
    // Problems found in the browser, and the size of the photos chosen per room.
    const [photoProblems, setPhotoProblems] = useState<Record<string, string[]>>({});
    const [photoBytes, setPhotoBytes] = useState<Record<string, number>>({});
    const [photoNames, setPhotoNames] = useState<Record<string, string[]>>({});

    /**
     * Submit through the action ourselves instead of <form action>. With <form action>, React resets
     * the form after every submit, which would untick the rooms and drop the chosen photos whenever
     * validation fails. This way the user's choices, including photos, stay put so they can just fix
     * the error and save again.
     */
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    const checkedCount = Object.values(included).filter(Boolean).length;
    const totalBytes = Object.entries(photoBytes)
        .filter(([key]) => included[key])
        .reduce((sum, [, bytes]) => sum + bytes, 0);
    const overTotal = totalBytes > MAX_TOTAL_PHOTO_BYTES;
    const hasClientProblems = overTotal || ROOM_OPTIONS.some((o) => included[o.key] && photoProblems[o.key]?.length);

    function onPhotosChange(key: RoomKey, event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        setPhotoProblems((prev) => ({ ...prev, [key]: checkRoomPhotos(files) }));
        setPhotoBytes((prev) => ({ ...prev, [key]: files.reduce((sum, f) => sum + f.size, 0) }));
        setPhotoNames((prev) => ({ ...prev, [key]: files.map((f) => `${f.name} (${formatBytes(f.size)})`) }));
    }

    /** Clears one room's chosen photos (a file input can't be emptied any other simple way). */
    function clearPhotos(key: RoomKey) {
        const input = document.getElementById(fid(`room-${key}-photos`)) as HTMLInputElement | null;
        if (input) {
            input.value = "";
            input.focus();
        }
        setPhotoProblems((prev) => ({ ...prev, [key]: [] }));
        setPhotoBytes((prev) => ({ ...prev, [key]: 0 }));
        setPhotoNames((prev) => ({ ...prev, [key]: [] }));
    }

    const describedBy = (...names: string[]) => names.map(fid).join(" ");
    const invalid = (name: string, clientProblems = false) => (errors[name] || clientProblems ? true : undefined);

    return (
        <form onSubmit={handleSubmit} noValidate aria-describedby={fid("form-message")} className="space-y-6">
            <fieldset className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <legend className="px-1 text-lg font-semibold">Report details</legend>
                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor={fid("type")} className={labelClass}>
                            Report type
                        </label>
                        <select
                            id={fid("type")}
                            name="type"
                            defaultValue={values.type ?? "move-in"}
                            aria-invalid={invalid("type")}
                            aria-describedby={describedBy("type-error")}
                            className={inputClass}
                        >
                            <option value="move-in">Move-in</option>
                            <option value="move-out">Move-out</option>
                        </select>
                        <FieldError id={fid("type-error")} messages={errors.type} />
                    </div>
                    <div>
                        <label htmlFor={fid("reportDate")} className={labelClass}>
                            Walkthrough date
                        </label>
                        <input
                            id={fid("reportDate")}
                            name="reportDate"
                            type="date"
                            max={today()}
                            defaultValue={values.reportDate ?? today()}
                            aria-invalid={invalid("reportDate")}
                            aria-describedby={describedBy("reportDate-error")}
                            className={inputClass}
                        />
                        <FieldError id={fid("reportDate-error")} messages={errors.reportDate} />
                    </div>
                </div>
            </fieldset>

            <fieldset
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
                aria-describedby={describedBy("rooms-hint", "rooms-error")}
            >
                <legend className="px-1 text-lg font-semibold">Room checklist</legend>
                <p id={fid("rooms-hint")} className="mt-1 text-sm text-stone-600">
                    Tick each room you checked. Photos: {ALLOWED_PHOTO_LABEL}, up to {MAX_PHOTOS_PER_ROOM} per room,{" "}
                    {formatBytes(MAX_PHOTO_BYTES)} each and {formatBytes(MAX_TOTAL_PHOTO_BYTES)} per report.
                </p>
                <p className="mt-2 text-sm font-medium text-stone-800" aria-live="polite">
                    {checkedCount} of {ROOM_OPTIONS.length} rooms ticked
                    {totalBytes > 0 && ` · ${formatBytes(totalBytes)} of photos`}
                </p>

                <ul className="mt-4 space-y-3">
                    {ROOM_OPTIONS.map((option) => {
                        const prefix = `room-${option.key}`;
                        const isOn = included[option.key];
                        const clientPhotoProblems = isOn ? (photoProblems[option.key] ?? []) : [];
                        const photoMessages = [...(errors[`${prefix}-photos`] ?? []), ...clientPhotoProblems];

                        return (
                            <li key={option.key} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        id={fid(`${prefix}-include`)}
                                        name={`${prefix}-include`}
                                        type="checkbox"
                                        checked={isOn}
                                        onChange={(e) => setIncluded((prev) => ({ ...prev, [option.key]: e.target.checked }))}
                                        aria-controls={fid(`${prefix}-details`)}
                                        aria-expanded={isOn}
                                        className="h-5 w-5 accent-teal-700"
                                    />
                                    <label htmlFor={fid(`${prefix}-include`)} className="font-semibold text-stone-800">
                                        {option.label}
                                    </label>
                                </div>

                                {/* A disabled fieldset's inputs aren't submitted, so unticked rooms are ignored. */}
                                <fieldset
                                    id={fid(`${prefix}-details`)}
                                    disabled={!isOn}
                                    hidden={!isOn}
                                    className="mt-4 grid gap-4 sm:grid-cols-2"
                                >
                                    <legend className="sr-only">{option.label} details</legend>
                                    {option.key === "other" && (
                                        <div className="sm:col-span-2">
                                            <label htmlFor={fid(`${prefix}-name`)} className={labelClass}>
                                                Room name
                                            </label>
                                            <input
                                                id={fid(`${prefix}-name`)}
                                                name={`${prefix}-name`}
                                                type="text"
                                                maxLength={80}
                                                defaultValue={values[`${prefix}-name`] ?? ""}
                                                aria-invalid={invalid(`${prefix}-name`)}
                                                aria-describedby={describedBy(`${prefix}-name-error`)}
                                                className={inputClass}
                                            />
                                            <FieldError id={fid(`${prefix}-name-error`)} messages={errors[`${prefix}-name`]} />
                                        </div>
                                    )}
                                    <div>
                                        <label htmlFor={fid(`${prefix}-condition`)} className={labelClass}>
                                            Condition
                                        </label>
                                        <select
                                            id={fid(`${prefix}-condition`)}
                                            name={`${prefix}-condition`}
                                            defaultValue={values[`${prefix}-condition`] ?? ""}
                                            aria-invalid={invalid(`${prefix}-condition`)}
                                            aria-describedby={describedBy(`${prefix}-condition-error`)}
                                            className={inputClass}
                                        >
                                            <option value="" disabled>
                                                Choose…
                                            </option>
                                            {CONDITIONS.map((c) => (
                                                <option key={c.value} value={c.value}>
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                        <FieldError id={fid(`${prefix}-condition-error`)} messages={errors[`${prefix}-condition`]} />
                                    </div>
                                    <div>
                                        <label htmlFor={fid(`${prefix}-photos`)} className={labelClass}>
                                            Photos <span className="font-normal text-stone-600">(optional)</span>
                                        </label>
                                        <input
                                            id={fid(`${prefix}-photos`)}
                                            name={`${prefix}-photos`}
                                            type="file"
                                            multiple
                                            accept={ALLOWED_PHOTO_TYPES.join(",")}
                                            onChange={(e) => onPhotosChange(option.key, e)}
                                            aria-invalid={photoMessages.length ? true : undefined}
                                            aria-describedby={describedBy(`${prefix}-photos-list`, `${prefix}-photos-error`)}
                                            className="block w-full text-sm text-stone-800 file:mr-3 file:rounded-lg file:border-0 file:bg-teal-700 file:px-3 file:py-2 file:font-semibold file:text-white hover:file:bg-teal-800"
                                        />
                                        <ul id={fid(`${prefix}-photos-list`)} className="mt-1 text-xs text-stone-600">
                                            {(photoNames[option.key] ?? []).map((name) => (
                                                <li key={name}>{name}</li>
                                            ))}
                                        </ul>
                                        {(photoNames[option.key]?.length ?? 0) > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => clearPhotos(option.key)}
                                                className="mt-1 text-sm font-semibold text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                                            >
                                                Remove photos<span className="sr-only"> from {option.label}</span>
                                            </button>
                                        )}
                                        <FieldError id={fid(`${prefix}-photos-error`)} messages={photoMessages} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label htmlFor={fid(`${prefix}-notes`)} className={labelClass}>
                                            Notes <span className="font-normal text-stone-600">(optional)</span>
                                        </label>
                                        <textarea
                                            id={fid(`${prefix}-notes`)}
                                            name={`${prefix}-notes`}
                                            rows={2}
                                            maxLength={1000}
                                            defaultValue={values[`${prefix}-notes`] ?? ""}
                                            aria-invalid={invalid(`${prefix}-notes`)}
                                            aria-describedby={describedBy(`${prefix}-notes-error`)}
                                            className={inputClass}
                                        />
                                        <FieldError id={fid(`${prefix}-notes-error`)} messages={errors[`${prefix}-notes`]} />
                                    </div>
                                </fieldset>
                            </li>
                        );
                    })}
                </ul>

                <FieldError
                    id={fid("rooms-error")}
                    messages={[
                        ...(errors.rooms ?? []),
                        ...(overTotal
                            ? [`Your photos add up to ${formatBytes(totalBytes)}; the limit is ${formatBytes(MAX_TOTAL_PHOTO_BYTES)} per report.`]
                            : []),
                    ]}
                />
            </fieldset>

            {/* Form-level message, e.g. "Please fix the highlighted fields" or an upload failure. */}
            <div id={fid("form-message")} aria-live="polite" aria-atomic="true">
                {state.message && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        <span className="font-semibold">Error: </span>
                        {state.message}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending || hasClientProblems}
                    className="w-full rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                    {isPending ? (totalBytes > 0 ? "Uploading photos…" : "Saving…") : "Save report"}
                </button>
                <Link href={`/properties/${propertyId}/condition`} className="font-semibold text-teal-700 hover:underline">
                    Cancel
                </Link>
                {hasClientProblems && (
                    <p className="text-sm text-red-700">Fix the photo problems above to save.</p>
                )}
            </div>
        </form>
    );
}

/** Always in the page, so screen readers announce messages when they appear. */
function FieldError({ id, messages }: { id: string; messages?: string[] }) {
    return (
        <div id={id} aria-live="polite" aria-atomic="true" className="mt-1 text-sm text-red-700">
            {messages?.map((message) => (
                <p key={message}>
                    <span className="font-semibold">Error: </span>
                    {message}
                </p>
            ))}
        </div>
    );
}
