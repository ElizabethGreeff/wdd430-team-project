import { NextResponse } from "next/server";
import { getApiUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";
import { getConditionReports } from "@/lib/condition-reports";
import type { ApiError, ConditionReportDTO } from "@/lib/types";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET /api/properties/:id/condition-reports → the property's move-in and move-out reports
export async function GET(
    _request: Request,
    context: RouteContext
): Promise<NextResponse<ConditionReportDTO[] | ApiError>> {
    const { id } = await context.params;

    // MongoDB ids are exactly 24 hex characters.
    if (!/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json({ message: "Invalid property ID" }, { status: 400 });
    }

    try {
        const userId = await getApiUserId();
        if (!userId) {
            return NextResponse.json({ message: "Sign in to continue." }, { status: 401 });
        }

        // Same 404 whether the property doesn't exist or belongs to someone else.
        const property = await getPropertyById(userId, id);
        if (!property) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        const reports = await getConditionReports(userId, id);
        return NextResponse.json(reports, { status: 200 });
    } catch (error) {
        console.error("GET /api/properties/[id]/condition-reports failed:", error);
        return NextResponse.json(
            { message: "Could not load condition reports" },
            { status: 500 }
        );
    }
}
