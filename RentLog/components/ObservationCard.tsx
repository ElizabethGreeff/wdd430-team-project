import ConditionBadge from "@/components/ConditionBadge";
import type { ObservationDTO } from "@/lib/types";

interface ObservationCardProps {
    observation: ObservationDTO;
}

/** One room from a walkthrough: name, condition, notes and photo count. */
export default function ObservationCard({ observation }: ObservationCardProps) {
    const photoCount = observation.photoUrls.length;

    return (
        <li className="flex flex-col gap-2 rounded-lg border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-semibold text-stone-900">{observation.room}</h4>
                <ConditionBadge condition={observation.condition} />
            </div>

            {observation.notes ? (
                <p className="text-sm text-stone-800">{observation.notes}</p>
            ) : (
                <p className="text-sm text-stone-600">No notes.</p>
            )}

            <p className="mt-auto text-xs text-stone-600">
                {photoCount === 0
                    ? "No photos"
                    : `${photoCount} ${photoCount === 1 ? "photo" : "photos"}`}
            </p>
        </li>
    );
}
