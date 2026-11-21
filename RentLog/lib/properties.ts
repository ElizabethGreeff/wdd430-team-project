
import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Property, { type PropertyDoc } from "@/models/Property";
import ConditionReport from "@/models/ConditionReport";
import type { PropertyDTO } from "@/lib/types";
import type { PropertyInput } from "@/lib/property-validation";

// What a plain document looks like when it comes back from MongoDB.
type LeanProperty = PropertyDoc & { _id: Types.ObjectId };

function toPropertyDTO(property: LeanProperty): PropertyDTO {
    return {
        id: property._id.toString(),
        name: property.name,
        address: property.address,
        city: property.city,
        region: property.region ?? null,
        postalCode: property.postalCode ?? null,
        landlordName: property.landlordName ?? null,
        monthlyRentCents: property.monthlyRentCents ?? null,
        currency: property.currency,
        leaseStart: property.leaseStart.toISOString(),
        leaseEnd: property.leaseEnd ? property.leaseEnd.toISOString() : null,
    };
}

// Stops a "city" like ".*" from being treated as a pattern.
function escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProperties(
    userId: string,
    city?: string | null
): Promise<PropertyDTO[]> {
    await connectToDatabase();

    const filter: { userId: string; city?: { $regex: string; $options: string } } = {
        userId,
    };

    if (city) {
        filter.city = { $regex: `^${escapeRegex(city)}$`, $options: "i" };
    }

    const properties = await Property.find(filter)
        .sort({ createdAt: -1 })
        .lean<LeanProperty[]>();

    return properties.map(toPropertyDTO);
}

export async function getPropertyById(
    userId: string,
    id: string
): Promise<PropertyDTO | null> {
    await connectToDatabase();

    const property = await Property.findOne({ _id: id, userId }).lean<LeanProperty | null>();

    return property ? toPropertyDTO(property) : null;
}

export async function createProperty(
    userId: string,
    input: PropertyInput
): Promise<PropertyDTO> {
    await connectToDatabase();

    const property = await Property.create({
        ...input,
        userId,
    });

    return toPropertyDTO(property.toObject() as LeanProperty);
}

export async function updateProperty(
    userId: string,
    id: string,
    input: PropertyInput
): Promise<PropertyDTO | null> {
    await connectToDatabase();

    const property = await Property.findOne({ _id: id, userId });

    if (!property) {
        return null;
    }

    Object.assign(property, input);
    await property.save();

    return toPropertyDTO(property.toObject() as LeanProperty);
}

export type DeletePropertyResult =
    | { deleted: true }
    | { deleted: false; reason: "not-found" | "has-reports" };

export async function deleteProperty(
    userId: string,
    id: string
): Promise<DeletePropertyResult> {
    await connectToDatabase();

    const property = await Property.findOne({ _id: id, userId });

    if (!property) {
        return { deleted: false, reason: "not-found" };
    }

    const hasReports = await ConditionReport.exists({
        userId,
        propertyId: property._id,
    });

    if (hasReports) {
        return { deleted: false, reason: "has-reports" };
    }

    await Property.deleteOne({ _id: property._id, userId });

    return { deleted: true };
}
