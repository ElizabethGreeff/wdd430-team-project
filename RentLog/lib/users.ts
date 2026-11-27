import "server-only";
import bcrypt from "bcryptjs";
import type { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import User, { type UserDoc } from "@/models/User";

type LeanUser = UserDoc & { _id: Types.ObjectId };

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

/**
 * The user whose email and password match, or null. Used only by the sign-in check in auth.ts.
 * The same null comes back for an unknown email and a wrong password, so the login page
 * never reveals which emails have accounts.
 */
export async function verifyCredentials(email: string, password: string): Promise<AuthUser | null> {
    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() }).lean<LeanUser | null>();
    if (!user) return null;

    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordsMatch) return null;

    return { id: user._id.toString(), name: user.name, email: user.email };
}

/** Thrown by createUser when the email already has an account. */
export class EmailTakenError extends Error {
    constructor() {
        super("An account with this email already exists.");
    }
}

/** Creates an account with a bcrypt-hashed password. */
export async function createUser(name: string, email: string, password: string): Promise<AuthUser> {
    await connectToDatabase();

    const passwordHash = await bcrypt.hash(password, 12);

    try {
        const user = await User.create({ name, email: email.toLowerCase(), passwordHash });
        return { id: user._id.toString(), name: user.name, email: user.email };
    } catch (error) {
        // 11000 is MongoDB's duplicate key error (the unique email index)
        if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
            throw new EmailTakenError();
        }
        throw error;
    }
}
