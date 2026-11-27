import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
    title: "Sign in",
    description: "Sign in to RentLog to see your properties, condition reports and expenses.",
};

export default function LoginPage() {
    return (
        <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">Sign in</h1>
            <p className="mt-2 mb-8 text-stone-600">Welcome back. Your rental records are waiting.</p>
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                {/* LoginForm reads ?callbackUrl, so it renders inside Suspense. */}
                <Suspense fallback={<p className="text-stone-600">Loading…</p>}>
                    <LoginForm />
                </Suspense>
            </div>
        </main>
    );
}
