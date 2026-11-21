import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";
import type { ApiError, PropertyDTO } from "@/lib/types";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    _request: Request,
    context: RouteContext
): Promise<NextResponse<PropertyDTO | ApiError>> {
    const { id } = await context.params;

    // MongoDB ids are exactly 24 hex characters.
    if (!/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json({ message: "Invalid property ID" }, { status: 400 });
    }

    try {
        const userId = await getCurrentUserId();
        const property = await getPropertyById(userId, id);

        // Same 404 whether it doesn't exist or belongs to someone else, so nothing leaks.
        if (!property) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        return NextResponse.json(property, { status: 200 });
    } catch (error) {
        console.error("GET /api/properties/[id] failed:", error);
        return NextResponse.json(
            { message: "Could not load property" },
            { status: 500 }
        );
    }
}