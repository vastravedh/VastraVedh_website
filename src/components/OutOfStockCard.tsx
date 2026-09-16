import Link from "next/link";
import { Product } from "@/data/types";
import ProductImage from "./ProductImage";
import NotifyMe from "./NotifyMe";

/**
 * A product card for the "Out of Stock" section: dimmed image with a Sold Out
 * ribbon and a Notify Me email capture.
 */
export default function OutOfStockCard({ product }: { product: Product }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-card">
      <Link
        href={`/product/${product.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden"
      >
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          tint={product.tint}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-0 top-4 bg-maroon px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-cream shadow">
          Sold Out
        </span>
      </Link>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium text-ink">
          {product.name}
        </h3>
        <p className="mt-0.5 text-xs text-ink/50">{product.fabric}</p>
        <div className="mt-3">
          <NotifyMe
            productId={product.id}
            slug={product.slug}
            name={product.name}
            compact
          />
        </div>
      </div>
    </div>
  );
}
