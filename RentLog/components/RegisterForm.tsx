"use client";

import { startTransition, useActionState, useId, type FormEvent } from "react";
import Link from "next/link";
import { register } from "@/lib/auth-actions";
import { initialRegisterFormState } from "@/lib/auth-form";

const inputClass =
    "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 aria-[invalid=true]:border-red-700";
const labelClass = "mb-1 block text-sm font-semibold text-stone-800";

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(register, initialRegisterFormState);

    const uid = useId();
    const fid = (name: string) => `${uid}-${name}`;

    // Submitting manually stops React from clearing the form when there are errors.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    /** id, name and the ARIA error wiring shared by every field. */
    const field = (name: string, hint = false) => ({
        id: fid(name),
        name,
        "aria-invalid": state.errors[name] ? true : undefined,
        "aria-describedby": [hint ? fid(`${name}-hint`) : null, fid(`${name}-error`)].filter(Boolean).join(" "),
    });

    return (
        <form action={formAction} onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
                <label htmlFor={fid("name")} className={labelClass}>
                    Name
                </label>
                <input
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={80}
                    defaultValue={state.values?.name ?? ""}
                    className={inputClass}
                    {...field("name")}
                />
                <FieldError id={fid("name-error")} messages={state.errors.name} />
            </div>
            <div>
                <label htmlFor={fid("email")} className={labelClass}>
                    Email
                </label>
                <input
                    type="email"
                    autoComplete="email"
                    required
                    defaultValue={state.values?.email ?? ""}
                    className={inputClass}
                    {...field("email")}
                />
                <FieldError id={fid("email-error")} messages={state.errors.email} />
            </div>
            <div>
                <label htmlFor={fid("password")} className={labelClass}>
                    Password
                </label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className={inputClass}
                    {...field("password", true)}
                />
                <p id={fid("password-hint")} className="mt-1 text-sm text-stone-600">
                    At least 8 characters.
                </p>
                <FieldError id={fid("password-error")} messages={state.errors.password} />
            </div>
            <div>
                <label htmlFor={fid("confirmPassword")} className={labelClass}>
                    Confirm password
                </label>
                <input
                    type="password"
                    autoComplete="new-password"
                    required
                    className={inputClass}
                    {...field("confirmPassword")}
                />
                <FieldError id={fid("confirmPassword-error")} messages={state.errors.confirmPassword} />
            </div>

            <div aria-live="polite" aria-atomic="true">
                {state.message && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <span className="font-semibold">Error: </span>
                        {state.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isPending ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-sm text-stone-600">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-teal-700 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}

/** Always in the page, so screen readers announce messages when they appear. */
function FieldError({ id, messages }: { id: string; messages?: string[] }) {
    return (
        <div id={id} aria-live="polite" aria-atomic="true" className="mt-1 text-sm text-red-700">
            {messages?.map((message) => (
                <p key={message}>
                    <span className="font-semibold">Error: </span>
                    {message}
                </p>
            ))}
        </div>
    );
}
