"use client";

import { useMemo, useState } from "react";
import { Product } from "@/data/types";
import ProductCard from "./ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export default function ProductFilters({
  products,
}: {
  products: Product[];
}) {
  const allFabrics = useMemo(
    () => Array.from(new Set(products.map((p) => p.fabric))).sort(),
    [products]
  );
  const allSizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))),
    [products]
  );

  const [maxPrice, setMaxPrice] = useState(() =>
    Math.max(...products.map((p) => p.price), 0)
  );
  const priceCeiling = useMemo(
    () => Math.max(...products.map((p) => p.price), 0),
    [products]
  );
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("featured");

  const toggle = (
    value: string,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    setList(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.price <= maxPrice);
    if (fabrics.length) result = result.filter((p) => fabrics.includes(p.fabric));
    if (sizes.length)
      result = result.filter((p) => p.sizes.some((s) => sizes.includes(s)));

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return result;
  }, [products, maxPrice, fabrics, sizes, sort]);

  const resetFilters = () => {
    setMaxPrice(priceCeiling);
    setFabrics([]);
    setSizes([]);
    setSort("featured");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Sidebar filters */}
      <aside className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold text-maroon">
            Filters
          </h3>
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-maroon underline hover:text-gold-dark"
          >
            Reset
          </button>
        </div>

        {/* Price */}
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Max Price</p>
          <input
            type="range"
            min={0}
            max={priceCeiling}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-maroon"
          />
          <p className="mt-1 text-xs text-ink/60">Up to ₹{maxPrice}</p>
        </div>

        {/* Fabric */}
        {allFabrics.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Fabric</p>
            <div className="space-y-1.5">
              {allFabrics.map((f) => (
                <label
                  key={f}
                  className="flex cursor-pointer items-center gap-2 text-sm text-ink/80"
                >
                  <input
                    type="checkbox"
                    checked={fabrics.includes(f)}
                    onChange={() => toggle(f, fabrics, setFabrics)}
                    className="accent-maroon"
                  />
                  {f}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Size */}
        {allSizes.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">Size</p>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(s, sizes, setSizes)}
                  className={`rounded border px-2.5 py-1 text-xs transition-colors ${
                    sizes.includes(s)
                      ? "border-maroon bg-maroon text-cream"
                      : "border-maroon/30 text-ink hover:border-maroon"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Results */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-ink/60">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-maroon/30 bg-white px-3 py-1.5 text-sm outline-none focus:border-maroon"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-ink/50">
            No products match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
