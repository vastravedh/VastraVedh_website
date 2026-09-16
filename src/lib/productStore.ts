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

/** Find one admin-created product by its slug (includes drafts). */
export async function getCustomProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const all = await getCustomProducts();
  return all.find((p) => p.slug === slug);
}

/** Mark one or more admin products as published (go live). */
export async function publishProducts(ids: string[]): Promise<void> {
  await Promise.all(
    ids
      .filter((id) => /^[a-z0-9-]+$/i.test(id))
      .map((id) =>
        col()
          .doc(id)
          .update({ status: "published" })
          .catch(() => undefined)
      )
  );
}

/**
 * Atomically reduce per-size stock for ordered items. Only affects
 * admin-created products stored in Firestore (built-in catalogue products
 * have no stock document and are silently skipped). Stock never goes below 0.
 *
 * Each entry is { productId, size, quantity }. Items without a productId or
 * for products with no `stock` map are ignored.
 */
export async function decrementStock(
  entries: { productId?: string; size: string; quantity: number }[]
): Promise<void> {
  // Group total quantity to subtract per product + size.
  const byProduct = new Map<string, Record<string, number>>();
  for (const e of entries) {
    if (!e.productId || !e.size || !(e.quantity > 0)) continue;
    const sizes = byProduct.get(e.productId) ?? {};
    sizes[e.size] = (sizes[e.size] ?? 0) + e.quantity;
    byProduct.set(e.productId, sizes);
  }
  if (byProduct.size === 0) return;

  await Promise.all(
    [...byProduct.entries()].map(([productId, sizeQty]) =>
      adminDb
        .runTransaction(async (tx) => {
          const ref = col().doc(productId);
          const snap = await tx.get(ref);
          if (!snap.exists) return; // not a Firestore product; skip
          const data = snap.data() as Product & { stock?: Record<string, number> };
          if (!data.stock) return; // no stock tracking for this product
          const stock = { ...data.stock };
          for (const [size, qty] of Object.entries(sizeQty)) {
            if (size in stock) {
              stock[size] = Math.max(0, (stock[size] ?? 0) - qty);
            }
          }
          tx.update(ref, { stock });
        })
        .catch(() => undefined)
    )
  );
}

export async function deleteCustomProduct(id: string): Promise<Product[]> {
  await col().doc(id).delete();
  // best-effort: remove uploaded images folder for this product in Storage.
  if (/^[a-z0-9-]+$/i.test(id)) {
    await deleteFolder(`uploads/${id}/`);
  }
  return getCustomProducts();
}
