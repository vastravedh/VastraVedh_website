"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type DraftItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  cover: string;
};

/**
 * Lists draft (unpublished) admin products with checkboxes so several can be
 * selected and published together. Each card links to the full preview page.
 */
export default function DraftManager({ drafts }: { drafts: DraftItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (drafts.length === 0) return null;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = selected.size === drafts.length;
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(drafts.map((d) => d.id)));

  const publish = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/product/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [...selected] }),
    });
    setBusy(false);
    if (res.ok) {
      setSelected(new Set());
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not publish selected products.");
    }
  };

  return (
    <section className="mt-8 rounded-lg border border-gold-dark/40 bg-cream-dark p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-semibold text-maroon">
            Drafts awaiting review ({drafts.length})
          </h2>
          <p className="mt-0.5 text-xs text-ink/60">
            Preview each product, then select and publish to make them live.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm font-medium text-maroon">{error}</span>}
          <button
            onClick={toggleAll}
            className="rounded-md border border-maroon/30 px-3 py-2 text-sm font-medium text-maroon hover:bg-maroon/5"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <button
            onClick={publish}
            disabled={busy || selected.size === 0}
            className="btn-primary disabled:opacity-50"
          >
            {busy
              ? "Publishing…"
              : `Publish ${selected.size > 0 ? `(${selected.size})` : ""}`}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {drafts.map((d) => {
          const checked = selected.has(d.id);
          return (
            <div
              key={d.id}
              className={`group relative overflow-hidden rounded-lg bg-white shadow-card ring-2 transition ${
                checked ? "ring-maroon" : "ring-transparent"
              }`}
            >
              {/* Select checkbox */}
              <label className="absolute left-2 top-2 z-10 flex cursor-pointer items-center gap-1 rounded bg-cream/95 px-2 py-1 text-xs font-medium text-ink shadow">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(d.id)}
                  className="accent-maroon"
                />
                Select
              </label>
              <span className="absolute right-2 top-2 z-10 rounded bg-ink/70 px-2 py-0.5 text-[10px] font-bold text-cream">
                DRAFT
              </span>

              <Link href={`/admin/preview/${d.slug}`}>
                <div className="relative aspect-[3/4]">
                  <Image
                    src={d.cover || "/placeholder.jpg"}
                    alt={d.name}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              </Link>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-medium text-ink">{d.name}</p>
                <p className="mt-0.5 text-xs text-ink/50">₹{d.price}</p>
                <Link
                  href={`/admin/preview/${d.slug}`}
                  className="mt-2 inline-block text-xs font-semibold text-maroon hover:underline"
                >
                  Preview →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
