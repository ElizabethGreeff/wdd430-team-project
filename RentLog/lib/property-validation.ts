
export interface PropertyInput {
    name: string;
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    landlordName?: string;
    monthlyRentCents?: number;
    currency: string;
    leaseStart: Date;
    leaseEnd?: Date;
}

type ValidationResult =
    | { success: true; data: PropertyInput }
    | { success: false; message: string };

export function validatePropertyInput(body: unknown): ValidationResult {
    if (
        typeof body !== "object" ||
        body === null ||
        Array.isArray(body)
    ) {
        return { success: false, message: "Request body must be an object" };
    }

    const data = body as Record<string, unknown>;

    const allowedFields = [
        "name",
        "address",
        "city",
        "region",
        "postalCode",
        "landlordName",
        "monthlyRentCents",
        "currency",
        "leaseStart",
        "leaseEnd",
    ];

    if (Object.keys(data).some((key) => !allowedFields.includes(key))) {
        return { success: false, message: "Request contains unsupported fields" };
    }

    function requiredString(field: string): string | null {
        const value = data[field];

        if (typeof value !== "string" || !value.trim()) {
            return null;
        }

        return value.trim();
    }

    function optionalString(field: string): string | undefined {
        const value = data[field];

        if (value === undefined || value === null || value === "") {
            return undefined;
        }

        return typeof value === "string" ? value.trim() || undefined : undefined;
    }

    const name = requiredString("name");
    const address = requiredString("address");
    const city = requiredString("city");

    if (!name || !address || !city) {
        return {
            success: false,
            message: "Name, address, and city are required",
        };
    }

    if (name.length > 100 || address.length > 200 || city.length > 100) {
        return {
            success: false,
            message: "Name, address, or city exceeds the allowed length",
        };
    }

    const leaseStartValue = data.leaseStart;

    if (
        typeof leaseStartValue !== "string" ||
        !leaseStartValue.trim() ||
        !Number.isFinite(Date.parse(leaseStartValue))
    ) {
        return { success: false, message: "A valid lease start date is required" };
    }

    const leaseStart = new Date(leaseStartValue);

    let leaseEnd: Date | undefined;

    if (data.leaseEnd !== undefined && data.leaseEnd !== null && data.leaseEnd !== "") {
        if (
            typeof data.leaseEnd !== "string" ||
            !Number.isFinite(Date.parse(data.leaseEnd))
        ) {
            return { success: false, message: "Lease end date must be valid" };
        }

        leaseEnd = new Date(data.leaseEnd);

        if (leaseEnd < leaseStart) {
            return {
                success: false,
                message: "Lease end date cannot be before lease start date",
            };
        }
    }

    let monthlyRentCents: number | undefined;

    if (
        data.monthlyRentCents !== undefined &&
        data.monthlyRentCents !== null &&
        data.monthlyRentCents !== ""
    ) {
        if (
            typeof data.monthlyRentCents !== "number" ||
            !Number.isSafeInteger(data.monthlyRentCents) ||
            data.monthlyRentCents < 0
        ) {
            return {
                success: false,
                message: "Monthly rent must be a non-negative whole number of cents",
            };
        }

        monthlyRentCents = data.monthlyRentCents;
    }

    const currency =
        typeof data.currency === "string" && data.currency.trim()
            ? data.currency.trim().toUpperCase()
            : "USD";

    if (!/^[A-Z]{3}$/.test(currency)) {
        return {
            success: false,
            message: "Currency must be a valid three-letter code",
        };
    }

    const optionalFields = ["region", "postalCode", "landlordName"];

    for (const field of optionalFields) {
        if (
            data[field] !== undefined &&
            data[field] !== null &&
            typeof data[field] !== "string"
        ) {
            return {
                success: false,
                message: `${field} must be text`,
            };
        }
    }

    return {
        success: true,
        data: {
            name,
            address,
            city,
            region: optionalString("region"),
            postalCode: optionalString("postalCode"),
            landlordName: optionalString("landlordName"),
            monthlyRentCents,
            currency,
            leaseStart,
            leaseEnd,
        },
    };
}
