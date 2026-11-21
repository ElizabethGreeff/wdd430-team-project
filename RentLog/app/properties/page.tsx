import { Suspense } from "react";
import { connection } from "next/server";
import PropertyCard from "@/components/PropertyCard";
import { getCurrentUserId } from "@/lib/current-user";
import { getProperties } from "@/lib/properties";

async function PropertyList() {
    await connection();

    const userId = await getCurrentUserId();
    const properties = await getProperties(userId);

    if (properties.length === 0) {
        return (
            <p className="mt-8 rounded-lg border border-stone-200 bg-white p-8 text-center text-stone-600">
                No properties yet.
            </p>
        );
    }

    return (
        <>
            <p className="mt-2 text-stone-600">
                {properties.length} {properties.length === 1 ? "property" : "properties"} on file
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </>
    );
}

export default function PropertiesPage() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">My Properties</h1>

            <Suspense fallback={<p className="mt-8 text-stone-600">Loading properties…</p>}>
                <PropertyList />
            </Suspense>
        </main>
    );
}