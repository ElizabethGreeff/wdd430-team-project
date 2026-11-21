import type { Metadata } from "next";
import ProfileForm from "@/components/ProfileForm";

export const metadata: Metadata = { title: "Profile settings" };

export default function ProfilePage() {
    return (
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">Profile settings</h1>
            <p className="mt-2 text-stone-600">
                Update the name and contact details linked to your RentLog account.
            </p>

            <section
                aria-labelledby="details-heading"
                className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <h2 id="details-heading" className="text-xl font-semibold">
                    Your details
                </h2>
                <ProfileForm />
            </section>

            <section
                aria-labelledby="account-heading"
                className="mt-6 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
            >
                <h2 id="account-heading" className="text-xl font-semibold">
                    Account
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                    Deleting your account will also remove your properties, condition
                    reports and expenses.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        disabled
                        className="min-h-11 rounded-lg border border-red-700 px-5 py-2.5 font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Delete account
                    </button>
                    <span className="text-sm text-stone-600">Coming soon</span>
                </div>
            </section>
        </main>
    );
}
