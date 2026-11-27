import { Suspense } from "react";
import UserMenu from "@/components/UserMenu";

// Every /properties page is private (see auth.config.ts), so they share the signed-in bar.
export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
                <Suspense fallback={null}>
                    <UserMenu />
                </Suspense>
            </div>
            {children}
        </>
    );
}
