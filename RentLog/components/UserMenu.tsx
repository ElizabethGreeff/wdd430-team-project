import { signOutAction } from "@/lib/auth-actions";
import { getSession } from "@/lib/current-user";

/**
 * "Signed in as …" with a Sign out button. Reads the session per request,
 * so it must render inside <Suspense>. Can move into the shared Navbar once that lands.
 */
export default async function UserMenu() {
    const session = await getSession();
    if (!session?.user) return null;

    return (
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
            <p className="text-stone-600">
                Signed in as <span className="font-semibold text-stone-800">{session.user.name ?? session.user.email}</span>
            </p>
            {/* A Server Action form, so signing out works even before JavaScript loads. */}
            <form action={signOutAction}>
                <button
                    type="submit"
                    className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 font-semibold text-stone-800 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                    Sign out
                </button>
            </form>
        </div>
    );
}
