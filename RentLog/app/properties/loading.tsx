import PropertyListSkeleton from "@/components/PropertyListSkeleton";

export default function PropertiesLoading() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">My Properties</h1>
            <PropertyListSkeleton />
        </main>
    );
}
