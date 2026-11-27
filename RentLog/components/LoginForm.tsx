"use client";

import { startTransition, useActionState, useEffect, useId, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/lib/auth-actions";
import { safeCallbackPath } from "@/lib/auth-form";

const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 aria-[invalid=true]:border-red-700";
const labelClass = "mb-1 block text-sm font-semibold text-stone-800";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

    const uid = useId();
    const fid = (name: string) => `${uid}-${name}`;
    const passwordRef = useRef<HTMLInputElement>(null);

    // A plain <form action> is reset by React after each submit, which would also clear the email.
    // Submitting manually keeps it, so after a typo only the password needs retyping.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set("redirectTo", safeCallbackPath(searchParams.get("callbackUrl"), window.location.origin));
        startTransition(() => formAction(formData));
    }

    // After a failed attempt: clear the password and move the cursor back to it.
    useEffect(() => {
        if (errorMessage && passwordRef.current) {
            passwordRef.current.value = "";
            passwordRef.current.focus();
        }
    }, [errorMessage]);

    return (
        <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor={fid("email")} className={labelClass}>
                    Email
                </label>
                <input
                    id={fid("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby={fid("error")}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor={fid("password")} className={labelClass}>
                    Password
                </label>
                <input
                    ref={passwordRef}
                    id={fid("password")}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    aria-invalid={errorMessage ? true : undefined}
                    aria-describedby={fid("error")}
                    className={inputClass}
                />
            </div>

            {/* Always in the page, so screen readers announce the message when it appears. */}
            <div id={fid("error")} aria-live="polite" aria-atomic="true">
                {errorMessage && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span className="font-semibold">Error: </span>
                        {errorMessage}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-center text-sm text-stone-600">
                New to RentLog?{" "}
                <Link href="/register" className="font-semibold text-teal-700 hover:underline">
                    Create an account
                </Link>
            </p>
        </form>
    );
}
