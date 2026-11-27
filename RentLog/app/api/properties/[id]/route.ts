
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import {
    deleteProperty,
    getPropertyById,
    updateProperty,
} from "@/lib/properties";
import { validatePropertyInput } from "@/lib/property-validation";
import type { ApiError, PropertyDTO } from "@/lib/types";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(
    _request: Request,
    context: RouteContext
): Promise<NextResponse<PropertyDTO | ApiError>> {
    const { id } = await context.params;

    if (!/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json(
            { message: "Invalid property ID" },
            { status: 400 }
        );
    }

    try {
        const userId = await getCurrentUserId();
        const property = await getPropertyById(userId, id);

        if (!property) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
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

export async function PUT(
    request: Request,
    context: RouteContext
): Promise<NextResponse<PropertyDTO | ApiError>> {
    const { id } = await context.params;

    if (!/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json(
            { message: "Invalid property ID" },
            { status: 400 }
        );
    }

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
        const property = await updateProperty(userId, id, validation.data);

        if (!property) {
            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(property, { status: 200 });
    } catch (error) {
        console.error("PUT /api/properties/[id] failed:", error);
        return NextResponse.json(
            { message: "Could not update property" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: RouteContext
): Promise<NextResponse<{ message: string }>> {
    const { id } = await context.params;

    if (!/^[a-f0-9]{24}$/i.test(id)) {
        return NextResponse.json(
            { message: "Invalid property ID" },
            { status: 400 }
        );
    }

    try {
        const userId = await getCurrentUserId();
        const result = await deleteProperty(userId, id);

        if (!result.deleted) {
            if (result.reason === "has-reports") {
                return NextResponse.json(
                    {
                        message:
                            "This property has condition reports. Remove or preserve those reports before deleting the property.",
                    },
                    { status: 409 }
                );
            }

            return NextResponse.json(
                { message: "Property not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Property deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("DELETE /api/properties/[id] failed:", error);
        return NextResponse.json(
            { message: "Could not delete property" },
            { status: 500 }
        );
    }
}
