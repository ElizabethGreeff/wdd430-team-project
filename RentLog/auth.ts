import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "@/lib/users";

const CredentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            // Returns the user when the email and password match, otherwise null ("Invalid email or password").
            async authorize(credentials) {
                const parsed = CredentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;

                // Only id, name and email go into the signed session cookie.
                return verifyCredentials(parsed.data.email, parsed.data.password);
            },
        }),
    ],
});
