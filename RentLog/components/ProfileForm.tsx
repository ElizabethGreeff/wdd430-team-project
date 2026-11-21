"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

interface ProfileValues {
    fullName: string;
    email: string;
    phone: string;
    currency: string;
}

type ProfileErrors = Partial<Record<"fullName" | "phone", string>>;

interface ProfileFormProps {
    initialValues?: ProfileValues;
}

const CURRENCIES = ["USD", "EUR", "GBP", "ZAR"] as const;

// Placeholder values until sign-in provides the real account details.
const DEFAULT_VALUES: ProfileValues = {
    fullName: "",
    email: "demo@rentlog.example",
    phone: "",
    currency: "USD",
};

const inputClass =
    "mt-1 block min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-stone-800 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-teal-600 aria-[invalid=true]:border-red-700";
const labelClass = "block text-sm font-semibold text-stone-800";
const errorClass = "mt-1 text-sm font-medium text-red-700";
const hintClass = "mt-1 text-sm text-stone-600";

function validate(values: ProfileValues): ProfileErrors {
    const errors: ProfileErrors = {};

    if (values.fullName.trim() === "") {
        errors.fullName = "Full name is required.";
    }

    if (values.phone.trim() !== "" && !/^[0-9+()\-\s]{7,20}$/.test(values.phone.trim())) {
        errors.phone = "Enter a valid phone number, e.g. +1 208 555 0123.";
    }

    return errors;
}

export default function ProfileForm({
    initialValues = DEFAULT_VALUES,
}: ProfileFormProps) {
    const [values, setValues] = useState<ProfileValues>(initialValues);
    const [errors, setErrors] = useState<ProfileErrors>({});
    const [message, setMessage] = useState<string>("");

    function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setValues((previous) => ({ ...previous, [name]: value }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        const newErrors = validate(values);
        setErrors(newErrors);

        const firstInvalid = Object.keys(newErrors)[0];
        if (firstInvalid) {
            const field = event.currentTarget.elements.namedItem(firstInvalid);
            if (field instanceof HTMLElement) field.focus();
            return;
        }

        // TODO(api): send `values` to the account API once sign-in and PATCH /api/account exist.
        setMessage("Looks good! Saving isn't connected yet, so nothing was changed.");
    }

    function handleCancel() {
        setValues(initialValues);
        setErrors({});
        setMessage("");
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            <div>
                <label htmlFor="fullName" className={labelClass}>
                    Full name <span className="text-red-700">*</span>
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={values.fullName}
                    onChange={handleChange}
                    aria-invalid={errors.fullName ? true : undefined}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    className={inputClass}
                />
                {errors.fullName && (
                    <p id="fullName-error" className={errorClass}>
                        {errors.fullName}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="email" className={labelClass}>
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    readOnly
                    value={values.email}
                    aria-describedby="email-hint"
                    className={`${inputClass} bg-stone-100 text-stone-700`}
                />
                <p id="email-hint" className={hintClass}>
                    Your email comes from your sign-in and can&apos;t be changed here.
                </p>
            </div>

            <div>
                <label htmlFor="phone" className={labelClass}>
                    Phone <span className="font-normal text-stone-600">(optional)</span>
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={handleChange}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClass}
                />
                {errors.phone && (
                    <p id="phone-error" className={errorClass}>
                        {errors.phone}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="currency" className={labelClass}>
                    Preferred currency
                </label>
                <select
                    id="currency"
                    name="currency"
                    value={values.currency}
                    onChange={handleChange}
                    aria-describedby="currency-hint"
                    className={inputClass}
                >
                    {CURRENCIES.map((code) => (
                        <option key={code} value={code}>
                            {code}
                        </option>
                    ))}
                </select>
                <p id="currency-hint" className={hintClass}>
                    Used as the default when you add rent and expenses.
                </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
                <button
                    type="submit"
                    className="min-h-11 rounded-lg bg-teal-700 px-5 py-2.5 font-semibold text-white hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                    Save changes
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="min-h-11 rounded-lg border border-stone-300 bg-white px-5 py-2.5 font-semibold text-stone-800 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                    Cancel
                </button>
            </div>

            <p role="status" className="text-sm font-medium text-stone-700">
                {message}
            </p>
        </form>
    );
}
