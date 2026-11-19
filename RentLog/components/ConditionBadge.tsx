import type { ConditionRating } from "@/lib/types";

interface ConditionBadgeProps {
    condition: ConditionRating;
}

// Colours follow the team design: emerald for good states, amber for watch, red for problems.
const styles: Record<ConditionRating, string> = {
    excellent: "bg-emerald-100 text-emerald-900",
    good: "bg-emerald-100 text-emerald-900",
    fair: "bg-amber-100 text-amber-900",
    poor: "bg-red-50 text-red-700",
    damaged: "bg-red-50 text-red-700",
};

const labels: Record<ConditionRating, string> = {
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    damaged: "Damaged",
};

export default function ConditionBadge({ condition }: ConditionBadgeProps) {
    return (
        <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[condition]}`}
        >
            {labels[condition]}
        </span>
    );
}
