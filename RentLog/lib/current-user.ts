// TODO(auth): replace with the signed-in user's id (e.g. Clerk's auth()) once sign-in lands.
// Every query filters by this id so one renter never sees another renter's properties.
export async function getCurrentUserId(): Promise<string> {
    return "demo-user";
}
