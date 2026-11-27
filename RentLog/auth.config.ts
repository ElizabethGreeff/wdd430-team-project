import type { NextAuthConfig } from "next-auth";

// Pages that belong to one renter. Signed-out visitors are sent to /login.
const PRIVATE_SECTIONS = ["/properties", "/expenses", "/packages", "/profile"];

export function isPrivatePath(pathname: string): boolean {
    return PRIVATE_SECTIONS.some((section) => pathname === section || pathname.startsWith(`${section}/`));
}

// Settings shared by proxy.ts and auth.ts. No bcrypt or database code here,
// so the proxy that runs before each request stays small.
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = Boolean(auth?.user);

            // Returning false sends the visitor to /login?callbackUrl=..., so they come back after signing in.
            if (isPrivatePath(nextUrl.pathname)) return isLoggedIn;

            // Someone already signed in doesn't need the login or register pages.
            if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
                return Response.redirect(new URL("/properties", nextUrl));
            }

            return true;
        },
        // Keep the MongoDB user id in the session, so queries can filter by it.
        jwt({ token, user }) {
            if (user?.id) token.sub = user.id;
            return token;
        },
        session({ session, token }) {
            if (token.sub) session.user.id = token.sub;
            return session;
        },
    },
    providers: [], // Added in auth.ts
} satisfies NextAuthConfig;
