import type { Metadata } from "next";
import RegisterForm from "@/components/RegisterForm";

export const metadata: Metadata = {
    title: "Create an account",
    description: "Create a free RentLog account to document your rental's condition and track expenses.",
};

export default function RegisterPage() {
    return (
        <main className="mx-auto w-full max-w-md px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">Create an account</h1>
            <p className="mt-2 mb-8 text-stone-600">
                Your properties, condition reports and photos are private to your account.
            </p>
            <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <RegisterForm />
            </div>
        </main>
    );
}
