import "server-only";
import { bucket } from "./admin";

/**
 * Helpers for uploading/deleting images in Firebase Storage. Uploaded files are
 * made publicly readable and referenced by their public HTTPS URL, so the rest
 * of the app can use them directly in <Image src=...> just like the old
 * /uploads/... paths.
 */

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function extForType(type: string): string {
  return EXT_BY_TYPE[type] ?? "jpg";
}

/** Public HTTPS URL for an object in the default bucket. */
function publicUrl(objectPath: string): string {
  const b = bucket().name;
  return `https://storage.googleapis.com/${b}/${objectPath}`;
}

/**
 * Upload a single file (from a Web File) under the given folder. Returns the
 * public URL. `objectPath` should NOT start with a slash.
 */
export async function uploadImage(
  objectPath: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const file = bucket().file(objectPath);
  await file.save(data, {
    contentType,
    resumable: false,
    metadata: { cacheControl: "public, max-age=31536000, immutable" },
  });
  await file.makePublic();
  return publicUrl(objectPath);
}

/** Delete an object given its public URL. Best-effort (ignores missing). */
export async function deleteByUrl(url: string): Promise<void> {
  const objectPath = objectPathFromUrl(url);
  if (!objectPath) return;
  try {
    await bucket().file(objectPath).delete();
  } catch {
    // ignore if already gone
  }
}

/** Delete every object under a folder prefix (e.g. a product's images). */
export async function deleteFolder(prefix: string): Promise<void> {
  try {
    await bucket().deleteFiles({ prefix });
  } catch {
    // ignore
  }
}

/** Extract the storage object path from a public googleapis/firebase URL. */
export function objectPathFromUrl(url: string): string | null {
  const b = bucket().name;
  // https://storage.googleapis.com/<bucket>/<path>
  const gcs = `https://storage.googleapis.com/${b}/`;
  if (url.startsWith(gcs)) return decodeURIComponent(url.slice(gcs.length));
  // https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encoded path>?...
  const fb = `https://firebasestorage.googleapis.com/v0/b/${b}/o/`;
  if (url.startsWith(fb)) {
    const rest = url.slice(fb.length).split("?")[0];
    return decodeURIComponent(rest);
  }
  return null;
}
