import "server-only";
import { adminDb } from "./firebase/admin";
import { deleteFolder } from "./firebase/storage";
import { Product } from "@/data/types";

/**
 * Server-only store for admin-created products, backed by the Firestore
 * `products` collection (document id = product id). These are merged with the
 * built-in catalogue across the site.
 */

const col = () => adminDb.collection("products");

export async function getCustomProducts(): Promise<Product[]> {
  // Newest first. `createdAt` is written on add; fall back gracefully if missing.
  const snap = await col().orderBy("createdAt", "desc").get().catch(async () => {
    return col().get();
  });
  return snap.docs.map((d) => {
    const { createdAt: _createdAt, ...rest } = d.data() as Product & {
      createdAt?: unknown;
    };
    return rest as Product;
  });
}

export async function addCustomProduct(p: Product): Promise<Product[]> {
  await col()
    .doc(p.id)
    .set({ ...p, createdAt: Date.now() });
  return getCustomProducts();
}

export async function deleteCustomProduct(id: string): Promise<Product[]> {
  await col().doc(id).delete();
  // best-effort: remove uploaded images folder for this product in Storage.
  if (/^[a-z0-9-]+$/i.test(id)) {
    await deleteFolder(`uploads/${id}/`);
  }
  return getCustomProducts();
}
