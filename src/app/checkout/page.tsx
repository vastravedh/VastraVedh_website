"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { findCoupon } from "@/data/coupons";

const HYD_DELIVERY_FEE = 49;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const couponCode =
    typeof window !== "undefined"
      ? localStorage.getItem("vastravedh_coupon") || ""
      : "";
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const total = subtotal - discount + HYD_DELIVERY_FEE;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    city: "Hyderabad",
    pincode: "",
    notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: form,
        couponCode: coupon?.code,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (res.ok) {
      clear();
      try {
        localStorage.removeItem("vastravedh_coupon");
      } catch {}
      router.push(`/order-confirmed?id=${data.orderId}`);
    } else {
      setError(data.error || "Could not place order. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon">
          Your cart is empty
        </h1>
        <Link href="/" className="btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-maroon/20 px-3 py-2.5 text-sm outline-none focus:border-maroon";
  const label = "mb-1 block text-sm font-medium text-ink";

  return (
    <div className="container-px py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold text-maroon">
        Checkout
      </h1>

      {/* Delivery notice */}
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-gold-dark/40 bg-cream-dark px-4 py-3">
        <span className="text-xl">⚡</span>
        <div className="text-sm">
          <p className="font-semibold text-maroon">
            1-hour delivery within Hyderabad
          </p>
          <p className="text-ink/70">
            We deliver your order within an hour inside Hyderabad. Delivery
            charges are extra ({formatINR(HYD_DELIVERY_FEE)}). Cash on Delivery
            only — we&apos;ll call you to confirm right after you place the order.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Customer form */}
        <form onSubmit={placeOrder} className="space-y-4">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Delivery Details
          </h2>

          <div>
            <label className={label}>Full Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className={field}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className={label}>Phone Number *</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={field}
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className={label}>Full Address *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className={field}
              placeholder="House / flat no, street, area"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Landmark</label>
              <input
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
                className={field}
                placeholder="Near..."
              />
            </div>
            <div>
              <label className={label}>Pincode *</label>
              <input
                required
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                className={field}
                placeholder="5000xx"
              />
            </div>
          </div>

          <div>
            <label className={label}>City *</label>
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className={field}
            />
            <p className="mt-1 text-xs text-ink/50">
              1-hour delivery applies within Hyderabad only.
            </p>
          </div>

          <div>
            <label className={label}>Delivery Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className={field}
              placeholder="Any instructions for delivery"
            />
          </div>

          {/* Payment method */}
          <div className="rounded-md border border-maroon/20 bg-white p-3">
            <p className="text-sm font-semibold text-ink">Payment Method</p>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="radio" checked readOnly className="accent-maroon" />
              Cash on Delivery (COD)
            </label>
          </div>

          {error && <p className="text-sm font-medium text-maroon">{error}</p>}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Placing order…" : `Place Order · ${formatINR(total)}`}
          </button>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-lg bg-white p-6 shadow-card">
          <h2 className="font-serif text-lg font-semibold text-maroon">
            Order Summary
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3">
                <div className="relative aspect-[3/4] w-12 flex-shrink-0 overflow-hidden rounded">
                  <Image
                    src={i.image || "/placeholder.jpg"}
                    alt={i.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <p className="line-clamp-1 font-medium text-ink">{i.name}</p>
                  <p className="text-ink/50">
                    {i.size} · Qty {i.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-maroon">
                  {formatINR(i.price * i.quantity)}
                </p>
              </div>
            ))}
          </div>

          <dl className="mt-4 space-y-2 border-t border-maroon/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gold-dark">
                <dt>Discount ({coupon?.percent}%)</dt>
                <dd>− {formatINR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/60">Delivery (Hyderabad)</dt>
              <dd>{formatINR(HYD_DELIVERY_FEE)}</dd>
            </div>
            <div className="flex justify-between border-t border-maroon/10 pt-2 text-base">
              <dt className="font-semibold">Total (COD)</dt>
              <dd className="font-bold text-maroon">{formatINR(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
