import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Property, { type PropertyDoc } from "@/models/Property";
import type { PropertyDTO } from "@/lib/types";

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

    const filter: { userId: string; city?: { $regex: string; $options: string } } =
        { userId };

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