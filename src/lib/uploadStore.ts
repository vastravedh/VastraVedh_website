import "server-only";
import { adminDb } from "./firebase/admin";
import { deleteByUrl } from "./firebase/storage";

/**
 * Server-only store mapping a product's baseId -> list of uploaded image URLs.
 *
 * Backed by Firestore: a single document `meta/uploads` whose fields are
 * baseId -> string[] of public Storage URLs. Image bytes live in Firebase
 * Storage (see the upload API routes). The rest of the app only calls
 * getUploadedImages / addUploadedImages / removeUploadedImage / getAllUploads,
 * so switching the backend to Firebase changed nothing above this layer.
 */

export type UploadMap = Record<string, string[]>;

const docRef = () => adminDb.collection("meta").doc("uploads");

async function readStore(): Promise<UploadMap> {
  const snap = await docRef().get();
  return (snap.exists ? (snap.data() as UploadMap) : {}) ?? {};
}

/** Full map (used by the app at request time to merge uploaded images). */
export async function getAllUploads(): Promise<UploadMap> {
  return readStore();
}

export async function getUploadedImages(baseId: string): Promise<string[]> {
  const map = await readStore();
  return map[baseId] ?? [];
}

export async function addUploadedImages(
  baseId: string,
  urls: string[]
): Promise<string[]> {
  const map = await readStore();
  const next = [...(map[baseId] ?? []), ...urls];
  await docRef().set({ [baseId]: next }, { merge: true });
  return next;
}

export async function removeUploadedImage(
  baseId: string,
  url: string
): Promise<string[]> {
  const map = await readStore();
  const next = (map[baseId] ?? []).filter((u) => u !== url);
  await docRef().set({ [baseId]: next }, { merge: true });
  // Best-effort delete of the object in Storage.
  await deleteByUrl(url);
  return next;
}
