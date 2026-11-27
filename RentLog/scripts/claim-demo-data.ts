// Moves the seeded "demo-user" properties and condition reports to a real account.
//
//   1. Create an account at /register
//   2. npx tsx --env-file=.env.local scripts/claim-demo-data.ts you@example.com
//
// Before sign-in existed, everything was saved under the placeholder id "demo-user".
// Now every query filters by the signed-in user's id, so that data is invisible until it's claimed.
import mongoose from "mongoose";
import { connectToDatabase } from "../lib/mongodb";
import Property from "../models/Property";
import ConditionReport from "../models/ConditionReport";
import User from "../models/User";

async function main() {
    const email = process.argv[2]?.trim().toLowerCase();
    if (!email) {
        console.error("Usage: npx tsx --env-file=.env.local scripts/claim-demo-data.ts you@example.com");
        process.exit(1);
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
        console.error(`No account found for ${email}. Create one at /register first.`);
        process.exit(1);
    }

    const userId = user._id.toString();
    const properties = await Property.updateMany({ userId: "demo-user" }, { $set: { userId } });
    const reports = await ConditionReport.updateMany({ userId: "demo-user" }, { $set: { userId } });

    console.log(
        `Moved ${properties.modifiedCount} properties and ${reports.modifiedCount} condition reports to ${email}.`
    );
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(() => mongoose.disconnect());
