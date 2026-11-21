import Skeleton from "@/components/Skeleton";

export default function ProfileFormSkeleton() {
    return (
        <div role="status" className="mt-6 space-y-5">
            <span className="sr-only">Loading profile form…</span>
            {Array.from({ length: 4 }, (_, index) => (
                <div key={index}>
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="mt-1 h-11 w-full rounded-lg" />
                </div>
            ))}
            <div className="flex gap-3 pt-2">
                <Skeleton className="h-11 w-36 rounded-lg" />
                <Skeleton className="h-11 w-24 rounded-lg" />
            </div>
        </div>
    );
}