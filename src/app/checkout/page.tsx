"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { findCoupon } from "@/data/coupons";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const couponCode =
    typeof window !== "undefined"
      ? localStorage.getItem("vastravedh_coupon") || ""
      : "";
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const total = subtotal - discount;

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
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    // Clear a field's error as soon as the user edits it.
    setFieldErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  /** Validate a single field's current value. Returns an error string or "". */
  const validateField = (
    k: keyof typeof form,
    value: string
  ): string => {
    const v = value.trim();
    switch (k) {
      case "name":
        if (!v) return "Please enter your full name.";
        if (v.length < 2) return "Name looks too short.";
        return "";
      case "phone": {
        const digits = v.replace(/\D/g, "");
        if (!digits) return "Please enter your phone number.";
        if (!/^[6-9]\d{9}$/.test(digits))
          return "Enter a valid 10-digit mobile number.";
        return "";
      }
      case "address":
        if (!v) return "Please enter your full address.";
        if (v.length < 10)
          return "Please add more detail (house/flat, street, area).";
        return "";
      case "city":
        if (!v) return "Please enter your city.";
        return "";
      case "pincode":
        if (!v) return "Please enter your pincode.";
        if (!/^\d{6}$/.test(v)) return "Pincode must be 6 digits.";
        return "";
      default:
        return "";
    }
  };

  /** Validate all required fields. Returns a map of field -> error. */
  const validateAll = (): Partial<Record<keyof typeof form, string>> => {
    const keys: (keyof typeof form)[] = [
      "name",
      "phone",
      "address",
      "city",
      "pincode",
    ];
    const errs: Partial<Record<keyof typeof form, string>> = {};
    for (const k of keys) {
      const msg = validateField(k, form[k]);
      if (msg) errs[k] = msg;
    }
    return errs;
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation first — show inline errors, don't submit.
    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }

    setBusy(true);

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

  const baseField =
    "w-full rounded-md border px-3 py-2.5 text-sm outline-none";
  const fieldClass = (k: keyof typeof form) =>
    `${baseField} ${
      fieldErrors[k]
        ? "border-red-500 focus:border-red-500"
        : "border-maroon/20 focus:border-maroon"
    }`;
  const label = "mb-1 block text-sm font-medium text-ink";
  const FieldError = ({ k }: { k: keyof typeof form }) =>
    fieldErrors[k] ? (
      <p className="mt-1 text-xs font-medium text-red-600">{fieldErrors[k]}</p>
    ) : null;

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
            We deliver your order within an hour inside Hyderabad. Cash on
            Delivery only — we&apos;ll call you to confirm right after you place
            the order.
          </p>
          <p className="mt-2 font-medium text-maroon">
            Free delivery is available within a 6 km radius. Charges apply
            beyond 6 km as per delivery partner rates.
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
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={(e) =>
                setFieldErrors((p) => ({
                  ...p,
                  name: validateField("name", e.target.value) || undefined,
                }))
              }
              className={fieldClass("name")}
              placeholder="Your name"
              aria-invalid={!!fieldErrors.name}
            />
            <FieldError k="name" />
          </div>

          <div>
            <label className={label}>Phone Number *</label>
            <input
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={(e) =>
                setFieldErrors((p) => ({
                  ...p,
                  phone: validateField("phone", e.target.value) || undefined,
                }))
              }
              className={fieldClass("phone")}
              placeholder="10-digit mobile number"
              aria-invalid={!!fieldErrors.phone}
            />
            <FieldError k="phone" />
          </div>

          <div>
            <label className={label}>Full Address *</label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              onBlur={(e) =>
                setFieldErrors((p) => ({
                  ...p,
                  address:
                    validateField("address", e.target.value) || undefined,
                }))
              }
              className={fieldClass("address")}
              placeholder="House / flat no, street, area"
              aria-invalid={!!fieldErrors.address}
            />
            <FieldError k="address" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Landmark</label>
              <input
                value={form.landmark}
                onChange={(e) => set("landmark", e.target.value)}
                className={fieldClass("landmark")}
                placeholder="Near..."
              />
            </div>
            <div>
              <label className={label}>Pincode *</label>
              <input
                inputMode="numeric"
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                onBlur={(e) =>
                  setFieldErrors((p) => ({
                    ...p,
                    pincode:
                      validateField("pincode", e.target.value) || undefined,
                  }))
                }
                className={fieldClass("pincode")}
                placeholder="5000xx"
                aria-invalid={!!fieldErrors.pincode}
              />
              <FieldError k="pincode" />
            </div>
          </div>

          <div>
            <label className={label}>City *</label>
            <input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              onBlur={(e) =>
                setFieldErrors((p) => ({
                  ...p,
                  city: validateField("city", e.target.value) || undefined,
                }))
              }
              className={fieldClass("city")}
              aria-invalid={!!fieldErrors.city}
            />
            <FieldError k="city" />
            <p className="mt-1 text-xs text-ink/50">
              1-hour delivery applies within Hyderabad only.
            </p>
          </div>

          <div>
            <label className={label}>Delivery Notes (optional)</label>
            <input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              className={fieldClass("notes")}
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
              <dt className="text-ink/60">Delivery</dt>
              <dd className="text-right text-xs text-ink/60">
                Free within 6 km ·<br />
                extra beyond as per partner
              </dd>
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
