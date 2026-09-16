"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

/** The sizes an admin can offer. Toggle on to sell + set stock. */
const SIZE_OPTIONS = ["Free Size", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"];

type PriceMode = "percent" | "amount" | "direct";

export default function NewProductForm({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // Pricing
  const [priceMode, setPriceMode] = useState<PriceMode>("percent");
  const [mrp, setMrp] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [directPrice, setDirectPrice] = useState("");

  // Sizes + per-size stock. Key = size, value = quantity string.
  const [sizeStock, setSizeStock] = useState<Record<string, string>>({});

  const toggleSize = (s: string) => {
    setSizeStock((prev) => {
      const next = { ...prev };
      if (s in next) {
        delete next[s];
      } else {
        next[s] = "1";
      }
      return next;
    });
  };

  const setStock = (s: string, qty: string) =>
    setSizeStock((prev) => ({ ...prev, [s]: qty }));

  // Compute the effective selling price from the chosen pricing mode.
  const computedPrice = useMemo(() => {
    const m = Number(mrp);
    if (priceMode === "direct") return Number(directPrice) || 0;
    if (!m || m <= 0) return 0;
    if (priceMode === "percent") {
      const pct = Number(discountPercent) || 0;
      return Math.max(0, Math.round(m - (m * pct) / 100));
    }
    // amount
    const amt = Number(discountAmount) || 0;
    return Math.max(0, Math.round(m - amt));
  }, [priceMode, mrp, discountPercent, discountAmount, directPrice]);

  // Live offer % preview, computed against MRP for all pricing modes.
  const offer = useMemo(() => {
    const base = Number(mrp) || 0;
    if (base > 0 && computedPrice > 0 && computedPrice < base) {
      return Math.round(((base - computedPrice) / base) * 100);
    }
    return 0;
  }, [mrp, computedPrice]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const selectedSizes = Object.keys(sizeStock);
    if (selectedSizes.length === 0) {
      setError("Select at least one size and set its quantity.");
      return;
    }
    if (computedPrice <= 0) {
      setError("Selling price must be greater than 0. Check your pricing inputs.");
      return;
    }

    setBusy(true);

    const fd = new FormData(e.currentTarget);
    fd.delete("files");
    files.forEach((f) => fd.append("files", f));

    // Send computed price + a JSON stock map (size -> qty).
    const stock: Record<string, number> = {};
    for (const s of selectedSizes) {
      stock[s] = Math.max(0, Math.floor(Number(sizeStock[s]) || 0));
    }
    fd.set("price", String(computedPrice));
    fd.set("sizes", selectedSizes.join(","));
    fd.set("stock", JSON.stringify(stock));

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

      {/* Pricing */}
      <fieldset className="rounded-md border border-maroon/20 p-4">
        <legend className="px-1 text-sm font-semibold text-maroon">Pricing</legend>

        <div>
          <label className={label}>Original Price (MRP) ₹ *</label>
          <input
            name="mrp"
            type="number"
            min="0"
            required
            value={mrp}
            onChange={(e) => setMrp(e.target.value)}
            className={field}
            placeholder="6999"
          />
        </div>

        {/* Mode radios */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="priceMode"
              value="percent"
              checked={priceMode === "percent"}
              onChange={() => setPriceMode("percent")}
              className="accent-maroon"
            />
            Discount by %
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="priceMode"
              value="amount"
              checked={priceMode === "amount"}
              onChange={() => setPriceMode("amount")}
              className="accent-maroon"
            />
            Discount by ₹ amount
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="priceMode"
              value="direct"
              checked={priceMode === "direct"}
              onChange={() => setPriceMode("direct")}
              className="accent-maroon"
            />
            Enter selling price directly
          </label>
        </div>

        {/* Mode-specific input */}
        <div className="mt-3">
          {priceMode === "percent" && (
            <div>
              <label className={label}>Discount Percentage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className={field}
                placeholder="50"
              />
            </div>
          )}
          {priceMode === "amount" && (
            <div>
              <label className={label}>Discount Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className={field}
                placeholder="3500"
              />
            </div>
          )}
          {priceMode === "direct" && (
            <div>
              <label className={label}>Selling Price (₹)</label>
              <input
                type="number"
                min="0"
                value={directPrice}
                onChange={(e) => setDirectPrice(e.target.value)}
                className={field}
                placeholder="3499"
              />
            </div>
          )}
        </div>

        {/* Computed selling price preview */}
        <div className="mt-3 rounded bg-cream-dark px-3 py-2 text-sm">
          <span className="text-ink/70">Selling Price: </span>
          <span className="font-bold text-maroon">₹{computedPrice || 0}</span>
          {offer > 0 && (
            <span className="ml-2 font-semibold text-gold-dark">
              ({offer}% OFF)
            </span>
          )}
        </div>
      </fieldset>

      {/* Sizes + stock */}
      <fieldset className="rounded-md border border-maroon/20 p-4">
        <legend className="px-1 text-sm font-semibold text-maroon">
          Sizes &amp; Stock *
        </legend>
        <p className="mb-3 text-xs text-ink/60">
          Click a size to offer it, then set how many are in stock. Sizes with
          0 quantity show as “Out of Stock”.
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((s) => {
            const active = s in sizeStock;
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                aria-pressed={active}
                className={`min-w-12 rounded border px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-maroon bg-maroon text-cream"
                    : "border-maroon/30 text-ink hover:border-maroon"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {Object.keys(sizeStock).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.keys(sizeStock).map((s) => (
              <div key={s} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium text-ink">{s}</span>
                <input
                  type="number"
                  min="0"
                  value={sizeStock[s]}
                  onChange={(e) => setStock(s, e.target.value)}
                  className={`${field} max-w-32`}
                  placeholder="Qty"
                />
                <span className="text-xs text-ink/50">
                  {Number(sizeStock[s]) > 0 ? "in stock" : "out of stock"}
                </span>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* Colors */}
      <div>
        <label className={label}>Colors (comma separated)</label>
        <input name="colors" className={field} placeholder="Maroon, Gold" />
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
