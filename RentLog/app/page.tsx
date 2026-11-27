import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-stone-200 bg-white p-8 sm:p-12 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
          Document your rental&apos;s condition and track maintenance expenses.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-stone-600 leading-relaxed">
          RentLog keeps your move-in and move-out evidence, room observations, and
          out-of-pocket maintenance receipts organized in one secure place; ready to
          review and send to your landlord when requesting a deposit return or reimbursement.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/properties"
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition-colors"
          >
            View Properties
          </Link>
          <Link
            href="/expenses"
            className="rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-800 hover:bg-stone-50 transition-colors"
          >
            Track Expenses
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">1. Condition Reports</h2>
          <p className="mt-2 text-sm text-stone-600">
            Log dated move-in and move-out observations room by room with supporting photos.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">2. Expense Ledger</h2>
          <p className="mt-2 text-sm text-stone-600">
            Record out-of-pocket repair costs and attach receipts to track reimbursement totals.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900">3. Evidence Packages</h2>
          <p className="mt-2 text-sm text-stone-600">
            Compile selected condition records and receipts into a clear package for your landlord.
          </p>
        </div>
      </section>
    </div>
  );
}
