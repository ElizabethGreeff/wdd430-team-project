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
