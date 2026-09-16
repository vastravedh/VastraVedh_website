"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/format";
import { findCoupon, Coupon } from "@/data/coupons";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, totalItems, clear } =
    useCart();

  const [codeInput, setCodeInput] = useState("");
  const [applied, setApplied] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState("");

  const applyCoupon = () => {
    const found = findCoupon(codeInput);
    if (!found) {
      setApplied(null);
      setCouponMsg("Invalid coupon code. Please check and try again.");
      return;
    }
    setApplied(found);
    setCouponMsg(`Applied "${found.code}" — ${found.percent}% off!`);
    try {
      localStorage.setItem("vastravedh_coupon", found.code);
    } catch {}
  };

  const removeCoupon = () => {
    setApplied(null);
    setCodeInput("");
    setCouponMsg("");
    try {
      localStorage.removeItem("vastravedh_coupon");
    } catch {}
  };

  const discount = applied ? Math.round((subtotal * applied.percent) / 100) : 0;
  const discountedSubtotal = subtotal - discount;
  // Delivery is free within a 6 km radius; charges beyond are collected by the
  // delivery partner, so the cart total doesn't add a flat shipping fee.
  const shipping = 0;
  const total = discountedSubtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-px py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-maroon">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink/60">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold text-maroon">
        Shopping Cart ({totalItems})
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-lg bg-white p-4 shadow-card"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative aspect-[3/4] w-24 flex-shrink-0 overflow-hidden rounded"
              >
                <Image
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-medium text-ink hover:text-maroon"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-ink/50">
                  Size: {item.size} · Color: {item.color}
                </p>
                <p className="mt-1 text-sm font-bold text-maroon">
                  {formatINR(item.price)}
                </p>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="inline-flex items-center rounded border border-maroon/30">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-maroon hover:bg-maroon/5"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-maroon hover:bg-maroon/5"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs font-medium text-maroon hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clear}
            className="text-sm font-medium text-ink/60 hover:text-maroon"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-lg bg-white p-6 shadow-card">
          <h2 className="font-serif text-lg font-semibold text-maroon">
            Order Summary
          </h2>

          {/* Coupon / promo code */}
          <div className="mt-4 rounded-md border border-dashed border-gold-dark/50 bg-cream/60 p-3">
            <label className="text-sm font-semibold text-ink">
              Apply Coupon
            </label>
            {applied ? (
              <div className="mt-2 flex items-center justify-between rounded bg-maroon/10 px-3 py-2">
                <span className="text-sm font-semibold text-maroon">
                  {applied.code} · {applied.percent}% OFF
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-medium text-maroon hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                  placeholder="Enter code"
                  className="w-full rounded border border-maroon/30 px-3 py-2 text-sm uppercase outline-none focus:border-maroon"
                />
                <button
                  onClick={applyCoupon}
                  className="rounded bg-maroon px-4 py-2 text-sm font-semibold text-cream hover:bg-maroon-dark"
                >
                  Apply
                </button>
              </div>
            )}
            {couponMsg && (
              <p
                className={`mt-2 text-xs font-medium ${
                  applied ? "text-gold-dark" : "text-maroon"
                }`}
              >
                {couponMsg}
              </p>
            )}
            <p className="mt-2 text-[11px] text-ink/50">
              Try: VED, RUGVED, RADHA, KHOUSIC
            </p>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd className="font-medium">{formatINR(subtotal)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-gold-dark">
                <dt>Discount ({applied?.percent}%)</dt>
                <dd className="font-medium">− {formatINR(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink/60">Delivery</dt>
              <dd className="text-right text-xs font-medium text-ink/60">
                Free within 6 km
              </dd>
            </div>
            <p className="text-xs text-ink/50">
              Charges apply beyond 6 km as per delivery partner rates.
            </p>
            <div className="mt-2 flex justify-between border-t border-maroon/10 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-maroon">{formatINR(total)}</dd>
            </div>
            {discount > 0 && (
              <p className="text-right text-xs font-medium text-gold-dark">
                You saved {formatINR(discount)}!
              </p>
            )}
          </dl>

          <Link href="/checkout" className="btn-primary mt-6 block w-full text-center">
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="mt-3 block text-center text-sm text-maroon hover:underline"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
