import mongoose from "mongoose";
import { connectToDatabase } from "../lib/mongodb";
import Property from "../models/Property";

async function main() {
    await connectToDatabase();

    await Property.deleteMany({ userId: "demo-user" });

    await Property.insertMany([
        {
            userId: "demo-user",
            name: "Maple Street Apartment",
            address: "12 Maple Street, Unit 4B",
            city: "Rexburg",
            region: "ID",
            postalCode: "83440",
            landlordName: "Pat Rivers",
            monthlyRentCents: 85000,
            leaseStart: new Date("2026-01-01"),
            leaseEnd: new Date("2026-12-31"),
        },
        {
            userId: "demo-user",
            name: "Campus View Studio",
            address: "300 College Ave",
            city: "Rexburg",
            region: "ID",
            landlordName: "Campus View Rentals",
            monthlyRentCents: 62500,
            leaseStart: new Date("2025-08-15"),
            leaseEnd: new Date("2026-08-14"),
        },
        {
            userId: "demo-user",
            name: "Riverside Duplex",
            address: "88 Riverside Drive",
            city: "Idaho Falls",
            region: "ID",
            postalCode: "83402",
            leaseStart: new Date("2026-09-01"),
        },
    ]);

    console.log("Seeded 3 demo properties");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());