import ProfileFormSkeleton from "@/components/ProfileFormSkeleton";

export default function ProfileLoading() {
    return (
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
            <h1 className="text-3xl font-bold md:text-4xl">Profile settings</h1>
            <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold">Your details</h2>
                <ProfileFormSkeleton />
            </section>
        </main>
    );
}