import { Product } from "@/data/types";

/**
 * Stock helpers shared across the storefront so "out of stock" is computed
 * consistently everywhere.
 *
 * Only admin-created products carry a `stock` map (size -> quantity). Built-in
 * catalogue products have no stock map and are treated as always available.
 */

/** True when the product tracks stock and has 0 for the given size. */
export function isSizeOutOfStock(product: Product, size: string): boolean {
  if (!hasStock(product)) return false;
  return (product.stock?.[size] ?? 0) <= 0;
}

/** Sizes that are currently purchasable. */
export function inStockSizes(product: Product): string[] {
  if (!hasStock(product)) return product.sizes;
  return product.sizes.filter((s) => (product.stock?.[s] ?? 0) > 0);
}

/** True when the product tracks stock and every size is 0. */
export function isFullyOutOfStock(product: Product): boolean {
  if (!hasStock(product)) return false;
  return inStockSizes(product).length === 0;
}

/** Whether this product tracks per-size stock at all. */
export function hasStock(product: Product): boolean {
  return !!product.stock && Object.keys(product.stock).length > 0;
}
