import PropertyCardSkeleton from "@/components/PropertyCardSkeleton";
import Skeleton from "@/components/Skeleton";

interface PropertyListSkeletonProps {
    count?: number;
}

export default function PropertyListSkeleton({
    count = 3,
}: PropertyListSkeletonProps) {
    return (
        <div role="status">
            <span className="sr-only">Loading properties…</span>
            <Skeleton className="mt-2 h-6 w-44" />
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: count }, (_, index) => (
                    <PropertyCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
