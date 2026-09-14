import { Product } from "./types";
import { productPhotos, colorTint } from "@/lib/productImages";

/**
 * Product image convention (upload real images by product ID):
 *
 *   public/products/<product-id>/1.jpg
 *   public/products/<product-id>/2.jpg
 *   ... up to 6.jpg
 *
 * e.g. the Banarasi saree (id "sa1") reads from:
 *   public/products/sa1/1.jpg, /products/sa1/2.jpg, ...
 *
 * Each product gets 6 image slots for the auto-sliding gallery.
 * Any missing file automatically falls back to /placeholder.jpg
 * (handled by the <ProductImage> component).
 */
export const IMAGES_PER_PRODUCT = 6;

// (placeholder; base image arrays are replaced by generated colour variants)
const img = (_seed: string) => "";

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KID_SIZES = ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"];
const PLUS_SIZES = ["3XL", "4XL", "5XL", "6XL"];

const baseProducts: Product[] = [
  // ---------- SUITS ----------
  {
    id: "s1",
    slug: "maroon-anarkali-suit-set",
    name: "Maroon Embroidered Anarkali Suit Set",
    category: "suits",
    price: 2499,
    mrp: 4999,
    images: [img("suit1a"), img("suit1b"), img("suit1c")],
    colors: ["Maroon", "Gold"],
    sizes: ALL_SIZES,
    fabric: "Georgette",
    rating: 4.6,
    reviews: 214,
    description:
      "A regal floor-length Anarkali in deep maroon with intricate gold zari embroidery. Comes with a matching dupatta and churidar.",
    isBestSeller: true,
  },
  {
    id: "s2",
    slug: "cotton-straight-suit-set",
    name: "Cream Cotton Straight Suit Set",
    category: "suits",
    price: 1499,
    mrp: 2999,
    images: [img("suit2a"), img("suit2b")],
    colors: ["Cream", "Maroon"],
    sizes: ALL_SIZES,
    fabric: "Cotton",
    rating: 4.3,
    reviews: 98,
    description:
      "Breathable cotton straight suit with block-printed motifs. Perfect for daily and office wear.",
    isNew: true,
  },
  // ---------- KURTAS ----------
  {
    id: "k1",
    slug: "gold-foil-print-kurta",
    name: "Gold Foil Print A-Line Kurta",
    category: "kurtas",
    price: 899,
    mrp: 1799,
    images: [img("kurta1a"), img("kurta1b")],
    colors: ["Maroon", "Gold"],
    sizes: ALL_SIZES,
    fabric: "Rayon",
    rating: 4.4,
    reviews: 176,
    description:
      "Elegant A-line kurta with gold foil print on a rich maroon base. Pairs beautifully with palazzos or leggings.",
    isBestSeller: true,
  },
  {
    id: "k2",
    slug: "printed-straight-kurta",
    name: "Floral Printed Straight Kurta",
    category: "kurtas",
    price: 749,
    mrp: 1499,
    images: [img("kurta2a"), img("kurta2b")],
    colors: ["Ivory", "Pink"],
    sizes: ALL_SIZES,
    fabric: "Viscose",
    rating: 4.1,
    reviews: 63,
    description:
      "Everyday floral straight kurta with a comfortable fit and side slits.",
  },
  // ---------- SAREES ----------
  {
    id: "sa1",
    slug: "banarasi-silk-saree",
    name: "Maroon Banarasi Silk Saree",
    category: "sarees",
    price: 3499,
    mrp: 6999,
    images: [img("saree1a"), img("saree1b"), img("saree1c")],
    colors: ["Maroon", "Gold"],
    sizes: ["Free Size"],
    fabric: "Banarasi Silk",
    rating: 4.8,
    reviews: 341,
    description:
      "Handwoven Banarasi silk saree with an ornate gold zari border and pallu. A timeless piece for special occasions.",
    isBestSeller: true,
  },
  {
    id: "sa2",
    slug: "chiffon-printed-saree",
    name: "Pastel Chiffon Printed Saree",
    category: "sarees",
    price: 1299,
    mrp: 2599,
    images: [img("saree2a"), img("saree2b")],
    colors: ["Pastel", "Gold"],
    sizes: ["Free Size"],
    fabric: "Chiffon",
    rating: 4.2,
    reviews: 87,
    description:
      "Lightweight chiffon saree with a delicate floral print and shimmer border.",
    isNew: true,
  },
  // ---------- LEHENGAS ----------
  {
    id: "l1",
    slug: "bridal-embroidered-lehenga",
    name: "Bridal Embroidered Lehenga Choli",
    category: "lehengas",
    price: 8999,
    mrp: 17999,
    images: [img("lehenga1a"), img("lehenga1b"), img("lehenga1c")],
    colors: ["Maroon", "Gold"],
    sizes: ALL_SIZES,
    fabric: "Velvet & Net",
    rating: 4.9,
    reviews: 122,
    description:
      "Show-stopping bridal lehenga with heavy hand embroidery, sequins and a flowing dupatta. Crafted for your big day.",
    isBestSeller: true,
  },
  {
    id: "l2",
    slug: "party-wear-lehenga",
    name: "Sequined Party-Wear Lehenga",
    category: "lehengas",
    price: 4499,
    mrp: 8999,
    images: [img("lehenga2a"), img("lehenga2b")],
    colors: ["Wine", "Gold"],
    sizes: ALL_SIZES,
    fabric: "Net",
    rating: 4.5,
    reviews: 74,
    description:
      "Glamorous sequined lehenga perfect for sangeet and festive celebrations.",
    isNew: true,
  },
  // ---------- BOTTOMS ----------
  {
    id: "b1",
    slug: "gold-palazzo-pants",
    name: "Solid Palazzo Pants",
    category: "bottoms",
    price: 599,
    mrp: 1199,
    images: [img("bottom1a"), img("bottom1b")],
    colors: ["Maroon", "Cream", "Black"],
    sizes: ALL_SIZES,
    fabric: "Rayon",
    rating: 4.0,
    reviews: 55,
    description:
      "Flowy wide-leg palazzos with an elasticated waist for all-day comfort.",
  },
  {
    id: "b2",
    slug: "churidar-leggings",
    name: "Stretch Churidar Leggings",
    category: "bottoms",
    price: 399,
    mrp: 799,
    images: [img("bottom2a"), img("bottom2b")],
    colors: ["Maroon", "Gold", "Black", "White"],
    sizes: ALL_SIZES,
    fabric: "Cotton Lycra",
    rating: 4.3,
    reviews: 210,
    description:
      "Soft stretch churidar leggings that pair with any kurta. Available in a range of shades.",
    isBestSeller: true,
  },
  // ---------- DRESSES ----------
  {
    id: "d1",
    slug: "indo-western-maxi-dress",
    name: "Indo-Western Printed Maxi Dress",
    category: "dresses",
    price: 1699,
    mrp: 3399,
    images: [img("dress1a"), img("dress1b")],
    colors: ["Maroon", "Multi"],
    sizes: ALL_SIZES,
    fabric: "Crepe",
    rating: 4.4,
    reviews: 91,
    description:
      "Floor-length maxi dress with an ethnic print and cinched waist for a flattering silhouette.",
    isNew: true,
  },
  // ---------- PLUS SIZE ----------
  {
    id: "p1",
    slug: "plus-size-anarkali-kurta",
    name: "Extra Love Anarkali Kurta",
    category: "plus-size",
    price: 1299,
    mrp: 2599,
    images: [img("plus1a"), img("plus1b")],
    colors: ["Maroon", "Gold"],
    sizes: PLUS_SIZES,
    fabric: "Rayon",
    rating: 4.5,
    reviews: 48,
    description:
      "Signature Anarkali kurta from the Extra Love collection, designed for a comfortable plus-size fit (3XL–6XL).",
  },
  // ---------- KIDS ----------
  {
    id: "kid1",
    slug: "kids-festive-lehenga",
    name: "Kids Festive Lehenga Set",
    category: "kids",
    price: 1499,
    mrp: 2999,
    images: [img("kid1a"), img("kid1b")],
    colors: ["Maroon", "Gold"],
    sizes: KID_SIZES,
    fabric: "Cotton Silk",
    rating: 4.6,
    reviews: 37,
    description:
      "Adorable festive lehenga set for little ones with light embroidery and comfortable lining.",
    isNew: true,
  },
];

// ---------------------------------------------------------------------------
// Colour variants
// ---------------------------------------------------------------------------
// Each base product is expanded into 3-4 cards that share the SAME design but
// differ by colour. Each card uses real photos with a brand-colour tint so
// variants look distinct. To use your own photos, upload them to
// public/products/<id>/ and point images there.

// A festive colour palette to draw variants from, per base product.
const VARIANT_COLORS = [
  "Maroon",
  "Gold",
  "Royal Blue",
  "Emerald",
  "Rani Pink",
  "Teal",
  "Mustard",
  "Plum",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Build the list of colours for a given base product: its own colours first,
// then top up from the shared palette until we have 3-4 variants.
function variantColorsFor(base: Product): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const target = 3 + (base.id.charCodeAt(base.id.length - 1) % 2); // 3 or 4

  for (const c of [...base.colors, ...VARIANT_COLORS]) {
    const key = c.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(c);
    if (result.length >= target) break;
  }
  return result;
}

export const products: Product[] = baseProducts.flatMap((base) => {
  const colors = variantColorsFor(base);
  return colors.map((color, idx) => {
    const isPrimary = idx === 0;
    const id = isPrimary ? base.id : `${base.id}-${slugify(color)}`;
    const slug = isPrimary ? base.slug : `${base.slug}-${slugify(color)}`;
    const name = isPrimary ? base.name : `${color} ${base.name}`;
    return {
      ...base,
      id,
      baseId: base.id,
      slug,
      name,
      variantColor: color,
      // All colours this card is available in (for the detail page selector).
      colors,
      // Real photos, offset per variant so cards differ visually.
      images: productPhotos(base.category, idx, IMAGES_PER_PRODUCT),
      tint: colorTint(color),
      // Keep badges only on the primary card to avoid over-badging.
      isNew: isPrimary ? base.isNew : false,
      isBestSeller: isPrimary ? base.isBestSeller : false,
    } as Product;
  });
});

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** One representative product per base (the primary colour variant). */
export function getBaseProducts(): Product[] {
  const seen = new Set<string>();
  const out: Product[] = [];
  for (const p of products) {
    const base = p.baseId ?? p.id;
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(p);
  }
  return out;
}

/** Find the sibling variant of a product for a given colour. */
export function getVariant(
  product: Product,
  color: string
): Product | undefined {
  const baseId = product.baseId ?? product.id;
  return products.find(
    (p) =>
      (p.baseId ?? p.id) === baseId &&
      (p.variantColor ?? "").toLowerCase() === color.toLowerCase()
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNew);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.category,
      p.fabric,
      p.description,
      ...p.colors,
    ]
      .join(" ")
      .toLowerCase();
    // match if every search term is found somewhere
    return terms.every((t) => haystack.includes(t));
  });
}
