import { isValidObjectId, type Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ConditionReport, {
    type ConditionReportDoc,
    type ObservationDoc,
} from "@/models/ConditionReport";
import type { ConditionReportDTO } from "@/lib/types";

// What plain documents look like when they come back from MongoDB with .lean().
type LeanObservation = ObservationDoc & { _id: Types.ObjectId };
type LeanReport = Omit<ConditionReportDoc, "observations"> & {
    _id: Types.ObjectId;
    observations: LeanObservation[];
};

function toConditionReportDTO(report: LeanReport): ConditionReportDTO {
    return {
        id: report._id.toString(),
        propertyId: report.propertyId.toString(),
        type: report.type,
        reportDate: report.reportDate.toISOString(),
        observations: report.observations.map((observation) => ({
            id: observation._id.toString(),
            room: observation.room,
            condition: observation.condition,
            notes: observation.notes ?? null,
            photoUrls: observation.photoUrls ?? [],
        })),
    };
}

/**
 * All condition reports for one property, newest first.
 * Filtered by userId as well as propertyId, so a renter can never read another renter's reports.
 * Callers should check the property exists for this user first (see getPropertyById).
 */
export async function getConditionReports(
    userId: string,
    propertyId: string
): Promise<ConditionReportDTO[]> {
    if (!isValidObjectId(propertyId)) return [];

    await connectToDatabase();

    const reports = await ConditionReport.find({ userId, propertyId })
        .sort({ reportDate: -1 })
        .lean<LeanReport[]>();

    return reports.map(toConditionReportDTO);
}
