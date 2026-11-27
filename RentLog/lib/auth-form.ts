// Shared by the auth Server Actions and the login/register forms.
// ("use server" files may only export async functions, so these live here.)

export interface RegisterFormState {
    message?: string;
    errors: Record<string, string[]>;
    /** What the user typed (never the passwords), so the form keeps it after an error. */
    values?: { name?: string; email?: string };
}

export const initialRegisterFormState: RegisterFormState = { errors: {} };

/** Only allows a return trip to a private page on this site, e.g. "/properties/abc/condition". */
export function safeCallbackPath(callbackUrl: string | null | undefined, origin: string): string {
    if (!callbackUrl) return "/properties";
    try {
        const url = new URL(callbackUrl, origin);
        const isPrivate = ["/properties", "/expenses", "/packages", "/profile"].some(
            (section) => url.pathname === section || url.pathname.startsWith(`${section}/`)
        );
        return url.origin === origin && isPrivate ? `${url.pathname}${url.search}` : "/properties";
    } catch {
        return "/properties";
    }
}
