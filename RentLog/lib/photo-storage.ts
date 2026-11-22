import "server-only";
import { del, put } from "@vercel/blob";

// Photos are stored in Vercel Blob; MongoDB keeps only their URLs.
// Vercel adds BLOB_READ_WRITE_TOKEN when a Blob store is connected to the project
// (pull it into RentLog/.env.local with `vercel env pull`).

export function isPhotoStorageConfigured(): boolean {
    return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** A safe file name for storage: lowercase letters, digits and dashes only. */
function safeName(name: string): string {
    const dot = name.lastIndexOf(".");
    const base = (dot > 0 ? name.slice(0, dot) : name).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const ext = dot > 0 ? name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
    return `${base || "photo"}.${ext}`;
}

/**
 * Uploads one photo and returns its public URL. A random suffix is added to every
 * file name, so URLs can't be guessed from the property or room.
 */
export async function uploadConditionPhoto(
    file: File,
    folder: { userId: string; propertyId: string; room: string }
): Promise<string> {
    const room = folder.room.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const pathname = `condition-reports/${folder.userId}/${folder.propertyId}/${room}/${safeName(file.name)}`;
    const blob = await put(pathname, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
    });
    return blob.url;
}

/** Best-effort cleanup when a report can't be saved after some photos were uploaded. */
export async function deleteConditionPhotos(urls: string[]): Promise<void> {
    if (urls.length === 0) return;
    try {
        await del(urls);
    } catch (error) {
        console.error("Could not remove orphaned photos:", error);
    }
}
