"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { searchProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";

  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="container-px py-10">
      <div className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">
          Search
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-maroon">
          {query ? `Results for “${query}”` : "Search VastraVedh"}
        </h1>
        {query && (
          <p className="mt-2 text-sm text-ink/60">
            {results.length} product{results.length !== 1 ? "s" : ""} found
          </p>
        )}
        <div className="mx-auto mt-3 h-0.5 w-16 bg-gold" />
      </div>

      {!query ? (
        <p className="py-16 text-center text-ink/50">
          Type something in the search bar above to find products.
        </p>
      ) : results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-ink/70">
            No products matched <span className="font-semibold">“{query}”</span>.
          </p>
          <p className="mt-2 text-sm text-ink/50">
            Try searching for “saree”, “kurta”, “lehenga”, or “maroon”.
          </p>
          <Link href="/" className="btn-primary mt-6">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
