import { Schema, model, models, type Model, type Types } from "mongoose";

export const REPORT_TYPES = ["move-in", "move-out"] as const;
export const CONDITION_RATINGS = ["excellent", "good", "fair", "poor", "damaged"] as const;

export type ReportType = (typeof REPORT_TYPES)[number];
export type ConditionRating = (typeof CONDITION_RATINGS)[number];

/** One room or item checked during a walkthrough. Stored inside its report. */
export interface ObservationDoc {
    room: string;
    condition: ConditionRating;
    notes?: string;
    photoUrls: string[];
}

export interface ConditionReportDoc {
    userId: string;
    propertyId: Types.ObjectId;
    type: ReportType;
    reportDate: Date;
    observations: ObservationDoc[];
}

// Observations are embedded rather than a separate collection: a report has a small,
// fixed set of rooms that are always read together with the report.
const observationSchema = new Schema<ObservationDoc>(
    {
        room: { type: String, required: true, trim: true, maxlength: 80 },
        condition: { type: String, required: true, enum: CONDITION_RATINGS },
        notes: { type: String, trim: true, maxlength: 1000 },
        // Photos live in file storage (e.g. Vercel Blob); MongoDB keeps only their URLs.
        photoUrls: { type: [String], default: [] },
    },
    { _id: true }
);

const conditionReportSchema = new Schema<ConditionReportDoc>(
    {
        userId: { type: String, required: true, index: true },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: "Property",
            required: true,
            index: true,
        },
        type: { type: String, required: true, enum: REPORT_TYPES },
        reportDate: { type: Date, required: true },
        observations: { type: [observationSchema], default: [] },
    },
    { timestamps: true }
);

// Reuse the model if it already exists (hot reloads would otherwise redefine it)
const ConditionReport =
    (models.ConditionReport as Model<ConditionReportDoc> | undefined) ??
    model<ConditionReportDoc>("ConditionReport", conditionReportSchema);

export default ConditionReport;
