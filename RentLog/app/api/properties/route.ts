import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { getProperties } from "@/lib/properties";
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
