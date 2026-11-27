import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ConditionReportForm from "@/components/ConditionReportForm";
import { createConditionReportAction } from "@/lib/condition-report-actions";
import { getCurrentUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";

export const metadata: Metadata = { title: "New condition report" };

type Params = Promise<{ id: string }>;

async function NewReport({ params }: { params: Params }) {
    await connection();

    const { id } = await params;
    if (!/^[a-f0-9]{24}$/i.test(id)) notFound();

    const userId = await getCurrentUserId();
    const property = await getPropertyById(userId, id);
    // Same 404 whether the property doesn't exist or belongs to someone else.
    if (!property) notFound();

    // bind() fixes the first argument, so the action knows which property the report is for.
    const action = createConditionReportAction.bind(null, id);

    return (
        <>
            <p className="mt-2 mb-8 text-stone-600">
                {property.name} · {property.address}
            </p>
            <ConditionReportForm action={action} propertyId={id} />
        </>
    );
}

export default function NewConditionReportPage({ params }: { params: Params }) {
    return (
        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
            <Link href="/properties" className="text-sm font-medium text-teal-700 hover:underline">
                ← Back to my properties
            </Link>
            <h1 className="mt-4 text-3xl font-bold md:text-4xl">New condition report</h1>
            <Suspense fallback={<p className="mt-4 text-stone-600">Loading property…</p>}>
                <NewReport params={params} />
            </Suspense>
        </main>
    );
}
