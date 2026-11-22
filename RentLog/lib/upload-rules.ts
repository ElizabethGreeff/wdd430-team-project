// Photo upload rules, shared by the browser (instant feedback) and the server (the real check).

export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ALLOWED_PHOTO_LABEL = "JPG, PNG or WebP";

/** Largest single photo. */
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MB
/** Most photos per room. */
export const MAX_PHOTOS_PER_ROOM = 3;
/**
 * Largest total upload per report. Kept under Vercel's 4.5 MB request limit;
 * next.config.ts raises the Server Action body limit to match.
 */
export const MAX_TOTAL_PHOTO_BYTES = 4 * 1024 * 1024; // 4 MB

/** Rooms offered in the checklist; "other" lets the renter type a room name. */
export const ROOM_OPTIONS = [
    { key: "living-room", label: "Living room" },
    { key: "kitchen", label: "Kitchen" },
    { key: "bathroom", label: "Bathroom" },
    { key: "bedroom", label: "Bedroom" },
    { key: "second-bedroom", label: "Second bedroom" },
    { key: "hallway", label: "Hallway / entrance" },
    { key: "laundry", label: "Laundry" },
    { key: "outdoor", label: "Balcony / outdoor" },
    { key: "other", label: "Other" },
] as const;

export type RoomKey = (typeof ROOM_OPTIONS)[number]["key"];

export function formatBytes(bytes: number): string {
    return bytes >= 1024 * 1024
        ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Checks one room's chosen photos. Returns a list of problems (empty when all is well).
 * Works with browser File objects and the File objects a Server Action receives.
 */
export function checkRoomPhotos(files: File[]): string[] {
    const problems: string[] = [];
    if (files.length > MAX_PHOTOS_PER_ROOM) {
        problems.push(`Choose up to ${MAX_PHOTOS_PER_ROOM} photos for each room (you chose ${files.length}).`);
    }
    for (const file of files) {
        if (!(ALLOWED_PHOTO_TYPES as readonly string[]).includes(file.type)) {
            problems.push(`"${file.name}" isn't a ${ALLOWED_PHOTO_LABEL} image.`);
        } else if (file.size > MAX_PHOTO_BYTES) {
            problems.push(`"${file.name}" is ${formatBytes(file.size)}; the limit is ${formatBytes(MAX_PHOTO_BYTES)} per photo.`);
        }
    }
    return problems;
}
