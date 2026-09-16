import "server-only";
import { Product } from "@/data/types";
import { products as builtIn } from "@/data/products";
import { getCustomProducts } from "./productStore";
import { getAllUploads } from "./uploadStore";

/**
 * The full catalogue at request time = built-in products + admin-created
 * products, with each product's images overridden by any admin uploads.
 * Everything public should read through these functions so custom products
 * and uploaded images show everywhere.
 */
async function allProducts(): Promise<Product[]> {
  const [custom, uploads] = await Promise.all([
    getCustomProducts(),
    getAllUploads(),
  ]);

  // Drafts are admin-only; never surface them to shoppers. Built-in products
  // (status undefined) and explicitly published ones remain visible.
  const merged = [...custom, ...builtIn].filter((p) => p.status !== "draft");

  return merged.map((p) => {
    const baseId = p.baseId ?? p.id;
    const up = uploads[baseId];
    if (up && up.length > 0) {
      return { ...p, images: up, tint: undefined };
    }
    return p;
  });
}

export async function catalogAll(): Promise<Product[]> {
  return allProducts();
}

export async function catalogByCategory(slug: string): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.category === slug);
}

export async function catalogFeatured(): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.isBestSeller);
}

export async function catalogNewArrivals(): Promise<Product[]> {
  return (await allProducts()).filter((p) => p.isNew);
}

export async function catalogOutOfStock(): Promise<Product[]> {
  const { isFullyOutOfStock } = await import("./stock");
  return (await allProducts()).filter(isFullyOutOfStock);
}

export async function catalogProduct(
  slug: string
): Promise<Product | undefined> {
  return (await allProducts()).find((p) => p.slug === slug);
}
