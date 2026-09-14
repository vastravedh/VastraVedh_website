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
}
