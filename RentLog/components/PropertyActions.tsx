
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PropertyActionsProps {
    propertyId: string;
}

export default function PropertyActions({
    propertyId,
}: PropertyActionsProps) {
    const router = useRouter();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setError("");
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/properties/${propertyId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message ?? "Could not delete property.");
                return;
            }

            setShowConfirmation(false);
            router.refresh();
        } catch {
            setError("A network error occurred. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <div className="mt-6 border-t border-stone-200 pt-4">
            <div className="flex items-center gap-3">
                <Link
                    href={`/properties/${propertyId}/edit`}
                    className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                    Edit
                </Link>

                <button
                    type="button"
                    onClick={() => {
                        setError("");
                        setShowConfirmation(true);
                    }}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                >
                    Delete
                </button>
            </div>

            {error && (
                <p role="alert" className="mt-3 text-sm text-red-700">
                    {error}
                </p>
            )}

            {showConfirmation && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowConfirmation(false);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-title"
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                    >
                        <h2
                            id="delete-title"
                            className="text-xl font-semibold text-stone-900"
                        >
                            Delete this property?
                        </h2>

                        <p className="mt-3 text-sm text-stone-600">
                            Are you sure you want to delete this property?
                            This action cannot be undone. Properties with
                            associated condition reports cannot be deleted.
                        </p>

                        {error && (
                            <p role="alert" className="mt-4 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setShowConfirmation(false)}
                                className="rounded-lg border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDelete}
                                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Confirm delete"}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
