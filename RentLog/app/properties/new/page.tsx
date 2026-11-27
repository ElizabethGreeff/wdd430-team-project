
import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";

export default function NewPropertyPage() {
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
                    Add a property
                </h1>

                <p className="mt-2 text-stone-600">
                    Enter the details of the property you are renting.
                </p>
            </div>

            <PropertyForm />
        </main>
    );
}
