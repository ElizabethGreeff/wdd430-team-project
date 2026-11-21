
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { createProperty, getProperties } from "@/lib/properties";
import { validatePropertyInput } from "@/lib/property-validation";
import type { ApiError, PropertyDTO } from "@/lib/types";

export async function GET(
    request: Request
): Promise<NextResponse<PropertyDTO[] | ApiError>> {
    try {
        const city = new URL(request.url).searchParams.get("city")?.trim();
        const userId = await getCurrentUserId();
        const properties = await getProperties(userId, city);

        return NextResponse.json(properties, { status: 200 });
    } catch (error) {
        console.error("GET /api/properties failed:", error);
        return NextResponse.json(
            { message: "Could not load properties" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request
): Promise<NextResponse<PropertyDTO | ApiError>> {
    try {
        let body: unknown;

        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { message: "Invalid JSON request body" },
                { status: 400 }
            );
        }

        const validation = validatePropertyInput(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: validation.message },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();
        const property = await createProperty(userId, validation.data);

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error("POST /api/properties failed:", error);
        return NextResponse.json(
            { message: "Could not create property" },
            { status: 500 }
        );
    }
}
