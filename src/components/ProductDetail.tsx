"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/data/types";
import { useCart } from "@/context/CartContext";
import { formatINR, discountPercent } from "@/lib/format";
import { getVariant } from "@/data/products";
import ProductImage from "./ProductImage";
import NotifyMe from "./NotifyMe";

export default function ProductDetail({
  product,
  preview = false,
}: {
  product: Product;
  /** When true, this is an admin preview: buying actions are disabled. */
  preview?: boolean;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);

  // Clicking a colour navigates to that colour's variant page.
  const selectColor = (c: string) => {
    if (c.toLowerCase() === (product.variantColor ?? "").toLowerCase()) return;
    const variant = getVariant(product, c);
    if (variant) router.push(`/product/${variant.slug}`);
  };
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const imageCount = product.images.length;

  // Keep the active index valid when the image set changes.
  useEffect(() => {
    setActiveImage(0);
  }, [product.slug]);

  // Auto-slide the gallery every 3s (pauses on hover)
  useEffect(() => {
    if (imageCount <= 1 || paused) return;
    const timer = setInterval(() => {
      setActiveImage((i) => (i + 1) % imageCount);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageCount, paused]);

  const goPrev = () =>
    setActiveImage((i) => (i - 1 + imageCount) % imageCount);
  const goNext = () => setActiveImage((i) => (i + 1) % imageCount);

  // Keyboard controls for the full-screen viewer
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    // Prevent background scroll while open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, imageCount]);

  // Per-size stock. Built-in catalogue products have no `stock` map and are
  // treated as always in stock.
  const hasStockInfo = !!product.stock && Object.keys(product.stock).length > 0;
  const stockFor = (s: string): number | null => {
    if (!hasStockInfo) return null; // null => unlimited / unknown => available
    return product.stock?.[s] ?? 0;
  };
  const isOutOfStock = (s: string) => {
    const q = stockFor(s);
    return q !== null && q <= 0;
  };
  const inStockSizes = product.sizes.filter((s) => !isOutOfStock(s));
  const allOutOfStock = hasStockInfo && inStockSizes.length === 0;

  const [size, setSize] = useState<string>(
    inStockSizes.length === 1 ? inStockSizes[0] : ""
  );
  const color = product.variantColor ?? product.colors[0] ?? "";
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const off = discountPercent(product.mrp, product.price);

  const handleAdd = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }
    const avail = stockFor(size);
    if (avail !== null && avail <= 0) {
      setError("This size is out of stock");
      return;
    }
    if (avail !== null && qty > avail) {
      setError(`Only ${avail} left in this size`);
      return;
    }
    setError("");
    addItem({
      id: `${product.id}-${size}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size,
      color,
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <div
          className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-lg bg-white"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          aria-label="View full-screen image"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setLightbox(true);
            }
          }}
        >
          <ProductImage
            src={product.images[activeImage]}
            alt={product.name}
            tint={product.tint}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-500"
          />

          {imageCount > 1 && (
            <>
              {/* Prev / Next arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/85 p-2 text-maroon opacity-0 shadow transition-opacity hover:bg-cream group-hover:opacity-100"
              >
                <ChevronIcon dir="left" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/85 p-2 text-maroon opacity-0 shadow transition-opacity hover:bg-cream group-hover:opacity-100"
              >
                <ChevronIcon dir="right" />
              </button>

              {/* Dot indicators (on a pill so they're always visible) */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-cream/85 px-2.5 py-1.5 shadow ring-1 ring-maroon/10 backdrop-blur-sm">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(i);
                    }}
                    aria-label={`Go to image ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      activeImage === i
                        ? "w-6 bg-maroon"
                        : "w-2 bg-maroon/30 hover:bg-maroon/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {imageCount > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-[3/4] w-16 flex-shrink-0 overflow-hidden rounded border-2 ${
                  activeImage === i ? "border-maroon" : "border-transparent"
                }`}
              >
                <ProductImage
                  src={src}
                  alt={`${product.name} view ${i + 1}`}
                  watermark={false}
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <nav className="mb-2 text-xs text-ink/50">
          Home / <span className="capitalize">{product.category.replace("-", " ")}</span> /{" "}
          <span className="text-maroon">{product.name}</span>
        </nav>

        <h1 className="font-serif text-3xl font-bold text-ink">
          {product.name}
        </h1>

        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="rounded bg-maroon px-2 py-0.5 text-xs font-semibold text-cream">
            ★ {product.rating.toFixed(1)}
          </span>
          <span className="text-ink/60">{product.reviews} reviews</span>
        </div>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-maroon">
            {formatINR(product.price)}
          </span>
          {off > 0 && (
            <>
              <span className="text-lg text-ink/40 line-through">
                {formatINR(product.mrp)}
              </span>
              <span className="text-sm font-semibold text-gold-dark">
                {off}% off
              </span>
            </>
          )}
        </div>
        <p className="mt-1 text-xs text-ink/50">Inclusive of all taxes</p>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-ink">
              Color:{" "}
              <span className="font-normal">
                {product.variantColor ?? color}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const selected =
                  c.toLowerCase() ===
                  (product.variantColor ?? "").toLowerCase();
                return (
                  <button
                    key={c}
                    onClick={() => selectColor(c)}
                    aria-pressed={selected}
                    className={`rounded border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-maroon bg-maroon text-cream"
                        : "border-maroon/30 text-ink hover:border-maroon"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sizes */}
        <div className="mt-6">
          <div className="mb-2 flex items-center gap-2">
            <p className="text-sm font-semibold text-ink">Select Size</p>
            {allOutOfStock && (
              <span className="rounded bg-maroon/10 px-2 py-0.5 text-xs font-semibold text-maroon">
                Out of Stock
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => {
              const out = isOutOfStock(s);
              const selected = size === s;
              return (
                <button
                  key={s}
                  type="button"
                  disabled={out}
                  onClick={() => {
                    if (out) return;
                    setSize(s);
                    setError("");
                  }}
                  aria-pressed={selected}
                  title={out ? "Out of stock" : undefined}
                  className={`relative min-w-12 rounded border px-3 py-2 text-sm transition-colors ${
                    out
                      ? "cursor-not-allowed border-ink/15 text-ink/40 line-through"
                      : selected
                        ? "border-maroon bg-maroon text-cream"
                        : "border-maroon/30 text-ink hover:border-maroon"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {/* Per-size availability hint */}
          {size && stockFor(size) !== null && stockFor(size)! > 0 && (
            <p className="mt-2 text-xs text-ink/50">
              {stockFor(size)} available in size {size}
            </p>
          )}
          {/* Notify me for a single sold-out size (product still partly available) */}
          {!preview && !allOutOfStock && size && isOutOfStock(size) && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs text-ink/60">
                Size {size} is sold out. Get an email when it&apos;s back:
              </p>
              <NotifyMe
                productId={product.id}
                slug={product.slug}
                name={product.name}
                size={size}
                compact
              />
            </div>
          )}
          {error && <p className="mt-2 text-sm font-medium text-maroon">{error}</p>}
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-ink">Quantity</p>
          <div className="inline-flex items-center rounded border border-maroon/30">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-lg text-maroon hover:bg-maroon/5"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button
              onClick={() =>
                setQty((q) => {
                  const max = stockFor(size);
                  if (max !== null && q >= max) return q; // cap at available stock
                  return q + 1;
                })
              }
              className="px-3 py-2 text-lg text-maroon hover:bg-maroon/5"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Actions */}
        {allOutOfStock && !preview ? (
          <div className="mt-8 rounded-lg border border-maroon/20 bg-cream-dark p-4">
            <p className="text-sm font-semibold text-maroon">
              This product is currently sold out
            </p>
            <p className="mt-0.5 mb-3 text-xs text-ink/60">
              Leave your email and we&apos;ll notify you as soon as it&apos;s
              back in stock.
            </p>
            <NotifyMe
              productId={product.id}
              slug={product.slug}
              name={product.name}
            />
          </div>
        ) : (
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleAdd}
              disabled={allOutOfStock || preview}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {preview
                ? "Add to Cart (preview)"
                : allOutOfStock
                  ? "Out of Stock"
                  : added
                    ? "Added to Cart ✓"
                    : "Add to Cart"}
            </button>
            <button
              disabled={allOutOfStock || preview}
              className="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              Buy Now
            </button>
          </div>
        )}

        {/* Details */}
        <div className="mt-8 border-t border-maroon/10 pt-6">
          <h2 className="font-serif text-lg font-semibold text-maroon">
            Product Details
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            {product.description}
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-ink/50">Fabric</dt>
            <dd className="text-ink">{product.fabric}</dd>
            <dt className="text-ink/50">Available Colors</dt>
            <dd className="text-ink">{product.colors.join(", ")}</dd>
            <dt className="text-ink/50">Sizes</dt>
            <dd className="text-ink">{product.sizes.join(", ")}</dd>
          </dl>
        </div>
      </div>

      {/* Full-screen image viewer */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} full-screen image`}
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
            aria-label="Close full-screen"
            className="absolute right-4 top-4 rounded-full bg-cream/90 p-2 text-maroon shadow hover:bg-cream"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative h-[85vh] w-[92vw] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage
              src={product.images[activeImage]}
              alt={product.name}
              tint={product.tint}
              sizes="92vw"
              className="object-contain"
            />

            {imageCount > 1 && (
              <>
                <button
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/85 p-3 text-maroon shadow hover:bg-cream"
                >
                  <ChevronIcon dir="left" />
                </button>
                <button
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-cream/85 p-3 text-maroon shadow hover:bg-cream"
                >
                  <ChevronIcon dir="right" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-cream/85 px-3 py-2 shadow">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        activeImage === i
                          ? "w-6 bg-maroon"
                          : "w-2 bg-maroon/30 hover:bg-maroon/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dir === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}
