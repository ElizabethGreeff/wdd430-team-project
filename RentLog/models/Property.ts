import { Schema, model, models, type Model } from "mongoose";

export interface PropertyDoc {
    userId: string;
    name: string;
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    landlordName?: string;
    monthlyRentCents?: number;
    currency: string;
    leaseStart: Date;
    leaseEnd?: Date;
}

const propertySchema = new Schema<PropertyDoc>(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        region: { type: String, trim: true },
        postalCode: { type: String, trim: true },
        landlordName: { type: String, trim: true },
        monthlyRentCents: {
            type: Number,
            min: 0,
            validate: {
                validator: Number.isInteger,
                message: "monthlyRentCents must be a whole number of cents",
            },
        },
        currency: {
            type: String,
            default: "USD",
            uppercase: true,
            trim: true,
            minlength: 3,
            maxlength: 3,
        },
        leaseStart: { type: Date, required: true },
        leaseEnd: { type: Date },
    },
    { timestamps: true }
);

// Reuse the model if it already exists
const Property =
    (models.Property as Model<PropertyDoc> | undefined) ??
    model<PropertyDoc>("Property", propertySchema);

export default Property;