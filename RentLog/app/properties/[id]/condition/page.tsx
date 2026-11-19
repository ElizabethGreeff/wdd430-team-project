import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import ConditionReportCard from "@/components/ConditionReportCard";
import { getCurrentUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";
import { getConditionReports } from "@/lib/condition-reports";

type Params = Promise<{ id: string }>;

async function ConditionLogs({ params }: { params: Params }) {
    await connection();

    const { id } = await params;
    // MongoDB ids are exactly 24 hex characters; anything else can't be a property.
    if (!/^[a-f0-9]{24}$/i.test(id)) notFound();

    const userId = await getCurrentUserId();
    const property = await getPropertyById(userId, id);
    // Same 404 whether the property doesn't exist or belongs to someone else.
    if (!property) notFound();

    const reports = await getConditionReports(userId, id);

    return (
        <>
            <h1 className="text-3xl font-bold md:text-4xl">Condition logs</h1>
            <p className="mt-2 text-stone-600">
                {property.name} · {property.address}
            </p>

            {reports.length === 0 ? (
                <p className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">
                    No condition reports yet. Record a move-in walkthrough to protect your deposit.
                </p>
            ) : (
                <section aria-label="Condition reports" className="mt-8 space-y-6">
                    {reports.map((report) => (
                        <ConditionReportCard key={report.id} report={report} />
                    ))}
                </section>
            )}
        </>
    );
}

function ConditionLogsSkeleton() {
    return (
        <div aria-busy="true" aria-live="polite">
            <span className="sr-only">Loading condition logs…</span>
            <div className="h-10 w-64 animate-pulse rounded bg-stone-200" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-stone-200" />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="h-32 animate-pulse rounded-lg bg-stone-200" />
                ))}
            </div>
        </div>
    );
}

export default function ConditionLogsPage({ params }: { params: Params }) {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <Link href="/properties" className="text-sm font-medium text-teal-700 hover:underline">
                ← Back to my properties
            </Link>

            <div className="mt-4">
                <Suspense fallback={<ConditionLogsSkeleton />}>
                    <ConditionLogs params={params} />
                </Suspense>
            </div>
        </main>
    );
}
