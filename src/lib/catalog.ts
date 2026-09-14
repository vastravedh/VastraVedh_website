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

  const merged = [...custom, ...builtIn];

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

export async function catalogProduct(
  slug: string
): Promise<Product | undefined> {
  return (await allProducts()).find((p) => p.slug === slug);
}
