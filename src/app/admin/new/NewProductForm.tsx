"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function NewProductForm({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const [mrp, setMrp] = useState("");
  const [price, setPrice] = useState("");

  // Live offer % preview
  const offer = useMemo(() => {
    const m = Number(mrp);
    const p = Number(price);
    if (m > 0 && p > 0 && p < m) return Math.round(((m - p) / m) * 100);
    return 0;
  }, [mrp, price]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    // append files (the file input isn't part of the plain form serialization here)
    fd.delete("files");
    files.forEach((f) => fd.append("files", f));

    const res = await fetch("/api/admin/product", {
      method: "POST",
      body: fd,
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(data.error || "Could not save product.");
    }
  };

  const field =
    "w-full rounded-md border border-maroon/20 px-3 py-2 text-sm outline-none focus:border-maroon";
  const label = "mb-1 block text-sm font-medium text-ink";

  return (
    <form onSubmit={submit} className="mt-6 max-w-2xl space-y-5">
      {/* Name */}
      <div>
        <label className={label}>Product Name *</label>
        <input name="name" required className={field} placeholder="e.g. Maroon Banarasi Silk Saree" />
      </div>

      {/* Category */}
      <div>
        <label className={label}>Category *</label>
        <select name="category" required className={field} defaultValue="">
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Original Price (MRP) ₹</label>
          <input
            name="mrp"
            type="number"
            min="0"
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            className={field}
            placeholder="6999"
          />
        </div>
        <div>
          <label className={label}>Selling Price ₹ *</label>
          <input
            name="price"
            type="number"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={field}
            placeholder="3499"
          />
        </div>
      </div>
      {offer > 0 && (
        <p className="-mt-2 text-sm font-semibold text-gold-dark">
          Offer: {offer}% OFF
        </p>
      )}

      {/* Sizes & Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Sizes * (comma separated)</label>
          <input name="sizes" required className={field} placeholder="S, M, L, XL" />
        </div>
        <div>
          <label className={label}>Colors (comma separated)</label>
          <input name="colors" className={field} placeholder="Maroon, Gold" />
        </div>
      </div>

      {/* Fabric */}
      <div>
        <label className={label}>Fabric</label>
        <input name="fabric" className={field} placeholder="Banarasi Silk" />
      </div>

      {/* Rating & Reviews */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Rating (0–5)</label>
          <input
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            className={field}
            placeholder="4.6"
          />
        </div>
        <div>
          <label className={label}>Number of Reviews</label>
          <input name="reviews" type="number" min="0" className={field} placeholder="120" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={label}>Product Details / Description</label>
        <textarea
          name="description"
          rows={4}
          className={field}
          placeholder="Describe the product, fabric, occasion, styling..."
        />
      </div>

      {/* Images */}
      <div>
        <label className={label}>Product Images *</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-maroon file:px-4 file:py-2 file:text-cream hover:file:bg-maroon-dark"
        />
        {files.length > 0 && (
          <p className="mt-1 text-xs text-ink/60">
            {files.length} image(s) selected
          </p>
        )}
      </div>

      {error && <p className="text-sm font-medium text-maroon">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? "Saving…" : "Save Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-maroon/30 px-6 py-3 text-sm font-semibold text-maroon hover:bg-maroon/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
