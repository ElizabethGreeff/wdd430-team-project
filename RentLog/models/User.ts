import { Schema, model, models, type Model } from "mongoose";

export interface UserDoc {
    name: string;
    email: string;
    // bcrypt hash of the password. The password itself is never stored.
    passwordHash: string;
}

const userSchema = new Schema<UserDoc>(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        // unique creates an index, so two accounts can't share an email address
        email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
        passwordHash: { type: String, required: true },
    },
    { timestamps: true }
);

// Reuse the model if it already exists (hot reloads would otherwise redefine it)
const User = (models.User as Model<UserDoc> | undefined) ?? model<UserDoc>("User", userSchema);

export default User;
