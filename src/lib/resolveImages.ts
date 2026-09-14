import "server-only";
import { Product } from "@/data/types";
import { getAllUploads } from "./uploadStore";

/**
 * Given products (built at import time with default photos), override their
 * images with admin-uploaded photos when available. Uploaded images are keyed
 * by the product's baseId, so every colour variant of a base product picks up
 * the same uploaded set.
 *
 * When a product has uploaded images, we also drop the colour tint so the real
 * photo shows true-to-life.
 */
export async function withUploadedImages(
  input: Product[]
): Promise<Product[]> {
  const uploads = await getAllUploads();
  return input.map((p) => {
    const baseId = p.baseId ?? p.id;
    const up = uploads[baseId];
    if (up && up.length > 0) {
      return { ...p, images: up, tint: undefined };
    }
    return p;
  });
}

/** Single-product convenience wrapper. */
export async function withUploadedImagesOne(
  p: Product | undefined
): Promise<Product | undefined> {
  if (!p) return p;
  const [resolved] = await withUploadedImages([p]);
  return resolved;
}
