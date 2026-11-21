
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PropertyDTO } from "@/lib/types";

type PropertyFormProps = {
    initialData?: PropertyDTO;
};

export default function PropertyForm({ initialData }: PropertyFormProps) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const isEditing = Boolean(initialData);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const rentValue = formData.get("monthlyRent")?.toString().trim();

        const monthlyRentCents =
            rentValue === "" || rentValue === undefined
                ? null
                : Math.round(Number(rentValue) * 100);

        if (
            monthlyRentCents !== null &&
            (!Number.isFinite(monthlyRentCents) || monthlyRentCents < 0)
        ) {
            setError("Enter a valid, non-negative monthly rent.");
            setPending(false);
            return;
        }

        const body = {
            name: formData.get("name"),
            address: formData.get("address"),
            city: formData.get("city"),
            region: formData.get("region"),
            postalCode: formData.get("postalCode"),
            landlordName: formData.get("landlordName"),
            monthlyRentCents,
            currency: formData.get("currency"),
            leaseStart: formData.get("leaseStart"),
            leaseEnd: formData.get("leaseEnd"),
        };

        try {
            const response = await fetch(
                isEditing
                    ? `/api/properties/${initialData!.id}`
                    : "/api/properties",
                {
                    method: isEditing ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || "Could not save property.");
                return;
            }

            router.push("/properties");
            router.refresh();
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <p
                    role="alert"
                    className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-medium">
                        Property name *
                    </label>
                    <input
                        id="name"
                        name="name"
                        required
                        maxLength={100}
                        defaultValue={initialData?.name ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="mb-1 block text-sm font-medium">
                        Street address *
                    </label>
                    <input
                        id="address"
                        name="address"
                        required
                        maxLength={200}
                        defaultValue={initialData?.address ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="city" className="mb-1 block text-sm font-medium">
                        City *
                    </label>
                    <input
                        id="city"
                        name="city"
                        required
                        maxLength={100}
                        defaultValue={initialData?.city ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="region" className="mb-1 block text-sm font-medium">
                        State / Province
                    </label>
                    <input
                        id="region"
                        name="region"
                        defaultValue={initialData?.region ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="postalCode" className="mb-1 block text-sm font-medium">
                        Postal code
                    </label>
                    <input
                        id="postalCode"
                        name="postalCode"
                        defaultValue={initialData?.postalCode ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="landlordName" className="mb-1 block text-sm font-medium">
                        Landlord name
                    </label>
                    <input
                        id="landlordName"
                        name="landlordName"
                        defaultValue={initialData?.landlordName ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="monthlyRent" className="mb-1 block text-sm font-medium">
                        Monthly rent
                    </label>
                    <input
                        id="monthlyRent"
                        name="monthlyRent"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={
                            initialData?.monthlyRentCents != null
                                ? (initialData.monthlyRentCents / 100).toFixed(2)
                                : ""
                        }
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="currency" className="mb-1 block text-sm font-medium">
                        Currency
                    </label>
                    <input
                        id="currency"
                        name="currency"
                        required
                        minLength={3}
                        maxLength={3}
                        defaultValue={initialData?.currency ?? "USD"}
                        className="w-full rounded-md border border-stone-300 px-3 py-2 uppercase"
                    />
                </div>

                <div>
                    <label htmlFor="leaseStart" className="mb-1 block text-sm font-medium">
                        Lease start date *
                    </label>
                    <input
                        id="leaseStart"
                        name="leaseStart"
                        type="date"
                        required
                        defaultValue={initialData?.leaseStart.slice(0, 10) ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>

                <div>
                    <label htmlFor="leaseEnd" className="mb-1 block text-sm font-medium">
                        Lease end date
                    </label>
                    <input
                        id="leaseEnd"
                        name="leaseEnd"
                        type="date"
                        defaultValue={initialData?.leaseEnd?.slice(0, 10) ?? ""}
                        className="w-full rounded-md border border-stone-300 px-3 py-2"
                    />
                </div>
            </div>

            <p className="text-sm text-stone-500">* Required fields</p>

            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={pending}
                    className="rounded-md bg-stone-900 px-5 py-2 text-white hover:bg-stone-700 disabled:opacity-50"
                >
                    {pending
                        ? "Saving..."
                        : isEditing
                          ? "Save changes"
                          : "Create property"}
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/properties")}
                    className="rounded-md border border-stone-300 px-5 py-2 hover:bg-stone-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
