// The shape sent to the browser. Dates are ISO strings because JSON has no Date type.
// userId and timestamps are deliberately left out.
export interface PropertyDTO {
    id: string;
    name: string;
    address: string;
    city: string;
    region: string | null;
    postalCode: string | null;
    landlordName: string | null;
    monthlyRentCents: number | null;
    currency: string;
    leaseStart: string;
    leaseEnd: string | null;
}

export interface ApiError {
    message: string;
}

// ---------- Condition reports ----------

export type ReportType = "move-in" | "move-out";
export type ConditionRating = "excellent" | "good" | "fair" | "poor" | "damaged";

export interface ObservationDTO {
    id: string;
    room: string;
    condition: ConditionRating;
    notes: string | null;
    photoUrls: string[];
}

// Dates are ISO strings; userId is left out, like PropertyDTO.
export interface ConditionReportDTO {
    id: string;
    propertyId: string;
    type: ReportType;
    reportDate: string;
    observations: ObservationDTO[];
}
