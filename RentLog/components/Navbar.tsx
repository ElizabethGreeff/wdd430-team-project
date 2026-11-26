import Link from "next/link";

    export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link
            href="/"
            className="font-heading text-2xl font-bold tracking-tight text-stone-900 hover:text-stone-700 transition-colors"
            >
            RentLog
            </Link>

            <nav aria-label="Main Navigation">
            <ul className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-stone-600">
                <li>
                <Link
                    href="/properties"
                    className="hover:text-stone-900 transition-colors"
                >
                    Properties
                </Link>
                </li>
                <li>
                <Link
                    href="/expenses"
                    className="hover:text-stone-900 transition-colors"
                >
                    Expenses
                </Link>
                </li>
                <li>
                <Link
                    href="/packages"
                    className="hover:text-stone-900 transition-colors"
                >
                    Evidence Package
                </Link>
                </li>
            </ul>
            </nav>
        </div>
        </header>
    );
}
