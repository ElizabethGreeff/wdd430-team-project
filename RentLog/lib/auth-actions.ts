"use server";

import { AuthError } from "next-auth";
import { connection } from "next/server";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { createUser, EmailTakenError } from "@/lib/users";
import type { RegisterFormState } from "@/lib/auth-form";

/**
 * Login form action. Returns a message when sign-in fails. On success signIn() redirects
 * by throwing, so anything that isn't an AuthError must be re-thrown, not swallowed.
 */
export async function authenticate(
    _prevState: string | undefined,
    formData: FormData
): Promise<string | undefined> {
    await connection(); // Auth.js creates random tokens; this keeps that work at request time
    try {
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof AuthError) {
            return error.type === "CredentialsSignin"
                ? "Invalid email or password."
                : "Something went wrong while signing in. Please try again.";
        }
        throw error;
    }
}

const RegisterSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, { error: "Enter your name." })
            .max(80, { error: "Keep your name under 80 characters." }),
        email: z.email({ error: "Enter a valid email address." }).max(254),
        password: z
            .string()
            .min(8, { error: "Use at least 8 characters." })
            .max(72, { error: "Use 72 characters or fewer." }), // bcrypt only reads the first 72 bytes
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "The passwords don't match.",
        path: ["confirmPassword"],
    });

/** Register form action: validates, creates the account, then signs the new renter in. */
export async function register(_prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
    await connection();

    const raw = {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? "").trim().toLowerCase(),
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };
    const values = { name: raw.name, email: raw.email };

    const parsed = RegisterSchema.safeParse(raw);
    if (!parsed.success) {
        return {
            message: "Please fix the highlighted fields and try again.",
            errors: z.flattenError(parsed.error).fieldErrors,
            values,
        };
    }

    try {
        await createUser(parsed.data.name, parsed.data.email, parsed.data.password);
    } catch (error) {
        if (error instanceof EmailTakenError) {
            return {
                message: "Please fix the highlighted fields and try again.",
                errors: { email: ["An account with this email already exists. Sign in instead."] },
                values,
            };
        }
        console.error("register failed:", error);
        return { message: "Your account couldn't be created. Please try again.", errors: {}, values };
    }

    // Outside try/catch: signIn() redirects by throwing.
    await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirectTo: "/properties",
    });
    return { errors: {} };
}

export async function signOutAction(): Promise<void> {
    await connection();
    await signOut({ redirectTo: "/login" });
}
