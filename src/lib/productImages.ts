/**
 * Real online product photos (Unsplash) mapped by category, with a colour
 * tint overlay applied at render time so each colour variant looks distinct
 * while sharing the same base photo set.
 *
 * These are stable Unsplash photo IDs for Indian ethnic wear. If any fail,
 * <ProductImage> falls back to /placeholder.jpg.
 */

const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`;

// Verified working ethnic-wear / apparel photos (all return 200).
const ETHNIC = [
  U("1610030469983-98e550d6193c"),
  U("1595777457583-95e059d581b8"),
  U("1617627143750-d86bc21e42bb"),
  U("1571908599407-cdb918ed83bf"),
  U("1601288496920-b6154fe3626a"),
  U("1606760227091-3dd870d97f1d"),
];
const APPAREL = [
  U("1585487000160-6ebcfceb0d03"),
  U("1594633312681-425c7b97ccd1"),
  U("1617627143750-d86bc21e42bb"),
  U("1595777457583-95e059d581b8"),
];
const KIDS = [
  U("1518831959646-742c3a14ebf7"),
  U("1519238263530-99bdd11df2ea"),
  U("1503919545889-aef636e10ad4"),
  U("1476234251651-f353703a034d"),
];

// A pool of photos per category (all IDs verified to return 200).
const CATEGORY_PHOTOS: Record<string, string[]> = {
  suits: ETHNIC,
  kurtas: [...APPAREL, ETHNIC[0]],
  sarees: ETHNIC,
  lehengas: [ETHNIC[1], ETHNIC[0], ETHNIC[2], ETHNIC[3]],
  bottoms: APPAREL,
  dresses: [ETHNIC[2], ETHNIC[1], ETHNIC[4], APPAREL[0]],
  "plus-size": [ETHNIC[3], ETHNIC[0], APPAREL[1], ETHNIC[2]],
  kids: KIDS,
};

const HERO_PHOTO = U("1610030469983-98e550d6193c");

export function heroPhoto(): string {
  return HERO_PHOTO;
}

export function categoryPhoto(categorySlug: string, index = 0): string {
  const pool = CATEGORY_PHOTOS[categorySlug] ?? CATEGORY_PHOTOS.suits;
  return pool[index % pool.length];
}

/** Returns `count` photos for a product, offset so variants differ a little. */
export function productPhotos(
  categorySlug: string,
  offset: number,
  count: number
): string[] {
  const pool = CATEGORY_PHOTOS[categorySlug] ?? CATEGORY_PHOTOS.suits;
  return Array.from({ length: count }, (_, i) => pool[(offset + i) % pool.length]);
}

/**
 * A translucent brand-colour overlay (rgba) used to tint the photo so each
 * colour variant reads differently. Returned as a CSS gradient string.
 */
export function colorTint(colorName: string): string {
  const key = colorName.trim().toLowerCase();
  const tints: Record<string, string> = {
    maroon: "rgba(123,15,43,0.32)",
    wine: "rgba(123,15,43,0.32)",
    gold: "rgba(201,162,39,0.30)",
    golden: "rgba(201,162,39,0.30)",
    "royal blue": "rgba(30,58,95,0.34)",
    blue: "rgba(30,58,95,0.34)",
    navy: "rgba(30,58,95,0.34)",
    emerald: "rgba(30,91,79,0.34)",
    green: "rgba(30,91,79,0.34)",
    "rani pink": "rgba(166,25,76,0.32)",
    pink: "rgba(166,25,76,0.32)",
    teal: "rgba(15,110,110,0.32)",
    mustard: "rgba(184,134,11,0.30)",
    plum: "rgba(93,42,90,0.34)",
    purple: "rgba(93,42,90,0.34)",
    black: "rgba(20,20,20,0.35)",
    cream: "rgba(239,231,210,0.25)",
    ivory: "rgba(239,231,210,0.25)",
    white: "rgba(239,231,210,0.20)",
    pastel: "rgba(239,231,210,0.22)",
    multi: "rgba(123,15,43,0.20)",
  };
  return tints[key] ?? "rgba(123,15,43,0.28)";
}
