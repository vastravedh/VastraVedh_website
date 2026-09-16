import Link from "next/link";
import { Product } from "@/data/types";
import { formatINR, discountPercent } from "@/lib/format";
import { isFullyOutOfStock } from "@/lib/stock";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.mrp, product.price);
  const soldOut = isFullyOutOfStock(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-lg bg-white shadow-card transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          tint={product.tint}
          sizes="(max-width: 768px) 50vw, 25vw"
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            soldOut ? "opacity-70" : ""
          }`}
        />
        {soldOut && (
          <span className="absolute left-0 top-4 z-10 bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-cream shadow">
            Sold Out
          </span>
        )}
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-ink">
            New
          </span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute left-2 top-2 rounded bg-maroon px-2 py-0.5 text-[10px] font-bold uppercase text-cream">
            Bestseller
          </span>
        )}
        {off > 0 && (
          <span className="absolute right-2 top-2 rounded bg-ink/80 px-2 py-0.5 text-[10px] font-bold text-cream">
            {off}% OFF
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-ink group-hover:text-maroon">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-ink/50">{product.fabric}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-maroon">
            {formatINR(product.price)}
          </span>
          {off > 0 && (
            <span className="text-xs text-ink/40 line-through">
              {formatINR(product.mrp)}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-1 text-xs text-ink/60">
          <span className="text-gold-dark">★</span>
          {product.rating.toFixed(1)}
          <span className="text-ink/40">({product.reviews})</span>
        </div>
      </div>
    </Link>
  );
}
