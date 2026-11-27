import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { auth } from "@/auth";

/**
 * The signed-in renter's session, or null.
 * connection() marks the render as per-request first: a session (and the random tokens Auth.js
 * creates while reading it) must never end up in a prerendered page shared by everyone.
 */
export async function getSession() {
    await connection();
    return auth();
}

/**
 * The signed-in renter's id, for pages and Server Actions.
 * Every query filters by this id, so one renter never sees another renter's properties.
 * proxy.ts already sends signed-out visitors to /login; this is the server-side safety net.
 */
export async function getCurrentUserId(): Promise<string> {
    const session = await getSession();
    const userId = session?.user?.id;
    if (!userId) redirect("/login");
    return userId;
}

/** The signed-in renter's id for API routes, or null (the route then answers 401). */
export async function getApiUserId(): Promise<string | null> {
    const session = await getSession();
    return session?.user?.id ?? null;
}
