import mongoose from "mongoose";

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Keep one connection alive between hot reloads and serverless calls,
// so we don't open a new database connection on every request.
const globalForMongoose = globalThis as unknown as {
    mongooseCache?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose.mongooseCache ?? {
    conn: null,
    promise: null,
};
globalForMongoose.mongooseCache = cache;

export async function connectToDatabase(): Promise<typeof mongoose> {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(
            "MONGODB_URI is not set. Add it to .env.local (and to Vercel's environment variables)."
        );
    }

    if (cache.conn) {
        return cache.conn;
    }

    if (!cache.promise) {
        cache.promise = mongoose.connect(uri, { bufferCommands: false });
    }

    try {
        cache.conn = await cache.promise;
    } catch (error) {
        cache.promise = null;
        throw error;
    }

    return cache.conn;
}