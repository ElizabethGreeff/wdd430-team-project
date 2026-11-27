import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Next.js 16 renamed middleware.ts to proxy.ts (same job: it runs before each matching request).
// The authorized() callback in auth.config.ts decides whether the request may continue.
export default NextAuth(authConfig).auth;

export const config = {
    // Run on pages, but skip API routes (they return 401 themselves), Next.js internals and images.
    matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)"],
};
