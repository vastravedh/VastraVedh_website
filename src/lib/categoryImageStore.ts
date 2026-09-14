import "server-only";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase/admin";
import { deleteByUrl } from "./firebase/storage";

/**
 * Server-only store mapping a category slug -> uploaded banner image URL.
 * Used for the homepage "Shop by Category" tiles. Missing entries fall back
 * to the default category photo.
 *
 * Backed by Firestore document `meta/categoryImages` (slug -> public URL).
 * Image bytes live in Firebase Storage under uploads/categories/.
 */

export type CategoryImageMap = Record<string, string>;

const docRef = () => adminDb.collection("meta").doc("categoryImages");

async function readStore(): Promise<CategoryImageMap> {
  const snap = await docRef().get();
  return (snap.exists ? (snap.data() as CategoryImageMap) : {}) ?? {};
}

export async function getCategoryImages(): Promise<CategoryImageMap> {
  return readStore();
}

export async function setCategoryImage(
  slug: string,
  url: string
): Promise<CategoryImageMap> {
  const map = await readStore();
  const prev = map[slug];
  map[slug] = url;
  await docRef().set({ [slug]: url }, { merge: true });
  // Remove the previous image object in Storage, if replaced.
  if (prev && prev !== url) {
    await deleteByUrl(prev);
  }
  return map;
}

export async function removeCategoryImage(
  slug: string
): Promise<CategoryImageMap> {
  const map = await readStore();
  const prev = map[slug];
  delete map[slug];
  // Remove the field from the Firestore doc.
  await docRef()
    .update({ [slug]: FieldValue.delete() })
    .catch(() => undefined);
  if (prev) {
    await deleteByUrl(prev);
  }
  return map;
}
