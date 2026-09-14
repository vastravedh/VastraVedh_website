"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Confirmation() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-lg rounded-lg bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-maroon text-3xl text-cream">
          ✓
        </div>
        <h1 className="mt-5 font-serif text-3xl font-bold text-maroon">
          Order Confirmed!
        </h1>
        {id && (
          <p className="mt-1 text-sm text-ink/60">
            Order ID: <span className="font-mono font-semibold">{id}</span>
          </p>
        )}

        <div className="mt-6 rounded-lg border border-gold-dark/40 bg-cream-dark px-5 py-4 text-left">
          <p className="flex items-center gap-2 font-semibold text-maroon">
            <span className="text-xl">⚡</span> Delivery within 1 hour
          </p>
          <p className="mt-1 text-sm text-ink/70">
            Your order is confirmed for <strong>Cash on Delivery</strong>. Our
            team will call you shortly to confirm, and we&apos;ll deliver your
            product within an hour (Hyderabad). A confirmation SMS has been sent
            to your number.
          </p>
        </div>

        <p className="mt-6 text-sm text-ink/60">
          Thank you for shopping with VastraVedh.
          <br />
          <span className="italic text-maroon/70">Trending Meets Elegance</span>
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
