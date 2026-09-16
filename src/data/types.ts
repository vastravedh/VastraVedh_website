export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  price: number; // selling price in INR
  mrp: number; // original price in INR
  images: string[];
  colors: string[];
  sizes: string[];
  /**
   * Available quantity per size, e.g. { S: 5, M: 0, L: 3 }.
   * A size with 0 (or missing) is treated as out of stock.
   * Optional so built-in catalogue products (which are always available)
   * keep working without a stock map.
   */
  stock?: Record<string, number>;
  fabric: string;
  rating: number;
  reviews: number;
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  /** The colour this specific card represents (for generated colour variants). */
  variantColor?: string;
  /** Real uploaded images (if any) live under public/products/<baseId>/. */
  baseId?: string;
  /** CSS rgba overlay used to tint the photo to this variant's colour. */
  tint?: string;
  /**
   * Publish state for admin-created products. `draft` products are visible
   * only in the admin preview, never to shoppers. Built-in catalogue products
   * leave this undefined and are always treated as published.
   */
  status?: "draft" | "published";
}
