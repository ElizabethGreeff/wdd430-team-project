
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PropertyForm from "@/components/PropertyForm";
import { getCurrentUserId } from "@/lib/current-user";
import { getPropertyById } from "@/lib/properties";

type EditPropertyPageProps = {
    params: Promise<{ id: string }>;
};

async function EditPropertyContent({
    params,
}: EditPropertyPageProps) {
    const { id } = await params;

    if (!/^[a-f0-9]{24}$/i.test(id)) {
        notFound();
    }

    const userId = await getCurrentUserId();
    const property = await getPropertyById(userId, id);

    if (!property) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-2xl space-y-6 px-6 py-10">
            <div>
                <Link
                    href="/properties"
                    className="text-sm text-stone-600 hover:underline"
                >
                    ← Back to properties
                </Link>

                <h1 className="mt-4 text-3xl font-bold text-stone-900">
                    Edit property
                </h1>

                <p className="mt-2 text-stone-600">
                    Update the details for {property.name}.
                </p>
            </div>

            <PropertyForm initialData={property} />
        </main>
    );
}

export default function EditPropertyPage({
    params,
}: EditPropertyPageProps) {
    return (
        <Suspense
            fallback={
                <p className="mx-auto max-w-2xl px-6 py-10 text-stone-600">
                    Loading property...
                </p>
            }
        >
            <EditPropertyContent params={params} />
        </Suspense>
    );
}