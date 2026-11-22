import Image from "next/image";
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

            {photoCount > 0 ? (
                <ul className="mt-auto flex flex-wrap gap-2 pt-1" aria-label={`${observation.room} photos`}>
                    {observation.photoUrls.map((url, index) => (
                        <li key={url}>
                            {/* Opens the full-size photo in a new tab. */}
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                            >
                                <Image
                                    src={url}
                                    alt={`${observation.room}, photo ${index + 1} of ${photoCount} (opens full size)`}
                                    width={72}
                                    height={72}
                                    className="h-18 w-18 rounded-md border border-stone-200 object-cover"
                                />
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-auto text-xs text-stone-600">No photos</p>
            )}
        </li>
    );
}
