import ObservationCard from "@/components/ObservationCard";
import type { ConditionReportDTO, ConditionRating } from "@/lib/types";

interface ConditionReportCardProps {
    report: ConditionReportDTO;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
}

const NEEDS_ATTENTION: ConditionRating[] = ["poor", "damaged"];

/** A move-in or move-out walkthrough, with a grid of the rooms checked. */
export default function ConditionReportCard({ report }: ConditionReportCardProps) {
    const title = report.type === "move-in" ? "Move-in report" : "Move-out report";
    const roomCount = report.observations.length;
    const attentionCount = report.observations.filter((o) =>
        NEEDS_ATTENTION.includes(o.condition)
    ).length;
    const headingId = `report-${report.id}`;

    return (
        <article
            aria-labelledby={headingId}
            className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
        >
            <header className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 id={headingId} className="text-xl font-semibold">
                    {title}
                </h3>
                <p className="text-sm text-stone-600">
                    <time dateTime={report.reportDate}>{formatDate(report.reportDate)}</time>
                </p>
            </header>

            <p className="mt-1 text-sm text-stone-600">
                {roomCount} {roomCount === 1 ? "room" : "rooms"} checked
                {attentionCount > 0 && (
                    <>
                        {" · "}
                        <span className="font-medium text-red-700">
                            {attentionCount} need{attentionCount === 1 ? "s" : ""} attention
                        </span>
                    </>
                )}
            </p>

            {roomCount === 0 ? (
                <p className="mt-5 text-sm text-stone-600">No rooms recorded in this report yet.</p>
            ) : (
                <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {report.observations.map((observation) => (
                        <ObservationCard key={observation.id} observation={observation} />
                    ))}
                </ul>
            )}
        </article>
    );
}
