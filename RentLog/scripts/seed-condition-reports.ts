import mongoose from "mongoose";
import { connectToDatabase } from "../lib/mongodb";
import Property from "../models/Property";
import ConditionReport from "../models/ConditionReport";

// Adds demo move-in / move-out reports for the demo user's properties.
// Run scripts/seed.ts first so the properties exist.
async function main() {
    await connectToDatabase();

    const properties = await Property.find({ userId: "demo-user" }).sort({ createdAt: 1 }).lean();
    if (properties.length === 0) {
        throw new Error("No demo properties found. Run the property seed script first.");
    }

    await ConditionReport.deleteMany({ userId: "demo-user" });

    const [first, second] = properties;

    await ConditionReport.insertMany([
        {
            userId: "demo-user",
            propertyId: first._id,
            type: "move-in",
            reportDate: new Date("2026-01-01"),
            observations: [
                { room: "Living room", condition: "good", notes: "Small scuff on the wall behind the door.", photoUrls: [] },
                { room: "Kitchen", condition: "fair", notes: "Oven door hinge is loose; stain on the countertop near the sink.", photoUrls: [] },
                { room: "Bathroom", condition: "excellent", notes: "Newly regrouted tiles.", photoUrls: [] },
                { room: "Bedroom", condition: "poor", notes: "Carpet stain (about 20 cm) by the window; blind cord broken.", photoUrls: [] },
            ],
        },
        {
            userId: "demo-user",
            propertyId: first._id,
            type: "move-out",
            reportDate: new Date("2026-12-31"),
            observations: [
                { room: "Living room", condition: "good", notes: "Same scuff as at move-in.", photoUrls: [] },
                { room: "Kitchen", condition: "good", notes: "Oven hinge was repaired by the landlord in March.", photoUrls: [] },
                { room: "Bathroom", condition: "good", photoUrls: [] },
                { room: "Bedroom", condition: "damaged", notes: "Blind cord still broken (pre-existing, see move-in report).", photoUrls: [] },
            ],
        },
        ...(second
            ? [
                  {
                      userId: "demo-user",
                      propertyId: second._id,
                      type: "move-in" as const,
                      reportDate: new Date("2025-08-15"),
                      observations: [
                          { room: "Studio", condition: "good" as const, notes: "Freshly painted.", photoUrls: [] },
                          { room: "Bathroom", condition: "fair" as const, notes: "Slow drain in the shower.", photoUrls: [] },
                      ],
                  },
              ]
            : []),
    ]);

    console.log("Seeded demo condition reports");
}

main()
    .catch((error) => {
        console.error("Seeding failed:", error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
