import type { PropertyDTO } from "@/lib/types";

interface PropertyCardProps {
    property: PropertyDTO;
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

function formatRent(cents: number, currency: string): string {
    return (cents / 100).toLocaleString("en-US", { style: "currency", currency });
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const location = [property.city, property.region, property.postalCode]
        .filter(Boolean)
        .join(", ");

    return (
        <article className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">{property.name}</h2>
            <p className="mt-1 text-sm text-stone-600">{property.address}</p>
            <p className="text-sm text-stone-600">{location}</p>

            <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                    <dt className="text-stone-600">Lease</dt>
                    <dd className="text-right font-medium text-stone-800">
                        {formatDate(property.leaseStart)} –{" "}
                        {property.leaseEnd ? formatDate(property.leaseEnd) : "Ongoing"}
                    </dd>
                </div>

                {property.monthlyRentCents !== null && (
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-600">Monthly rent</dt>
                        <dd className="font-medium text-stone-800">
                            {formatRent(property.monthlyRentCents, property.currency)}
                        </dd>
                    </div>
                )}

                {property.landlordName && (
                    <div className="flex justify-between gap-4">
                        <dt className="text-stone-600">Landlord</dt>
                        <dd className="font-medium text-stone-800">{property.landlordName}</dd>
                    </div>
                )}
            </dl>
        </article>
    );
}
