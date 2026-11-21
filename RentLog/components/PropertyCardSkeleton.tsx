import Skeleton from "@/components/Skeleton";

export default function PropertyCardSkeleton() {
    return (
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="mt-1 h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />

            <div className="mt-5 space-y-2">
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex justify-between gap-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-28" />
                </div>
            </div>
        </div>
    );
}
