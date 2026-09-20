"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type Review = {
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
};

/** Star row (display or interactive). */
function Stars({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          style={{ lineHeight: 0 }}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill={n <= value ? "#C9A227" : "none"} stroke="#C9A227" strokeWidth="1.5">
            <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [myReview, setMyReview] = useState<{ rating: number; comment: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Write-form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reviews?productId=${encodeURIComponent(productId)}&name=${encodeURIComponent(productName)}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setCanReview(!!data.canReview);
      setLoggedIn(!!data.loggedIn);
      setMyReview(data.myReview ?? null);
      if (data.myReview) {
        setRating(data.myReview.rating);
        setComment(data.myReview.comment);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [productId, productName]);

  useEffect(() => {
    load();
  }, [load, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        await load();
      } else {
        setError(data.error || "Could not submit your review.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const count = reviews.length;
  const avg =
    count > 0 ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / count) * 10) / 10 : 0;

  return (
    <div id="reviews" className="mt-8 scroll-mt-24 border-t border-maroon/10 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-maroon">
          Ratings &amp; Reviews
        </h2>
        {count > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Stars value={Math.round(avg)} />
            <span className="font-semibold text-ink">{avg}</span>
            <span className="text-ink/50">({count})</span>
          </div>
        )}
      </div>

      {/* Write / eligibility */}
      <div className="mt-4 rounded-lg border border-maroon/15 bg-white p-4">
        {!loggedIn ? (
          <p className="text-sm text-ink/70">
            <Link href="/account" className="font-medium text-maroon hover:underline">
              Sign in
            </Link>{" "}
            to rate this product. Only customers who bought it can review.
          </p>
        ) : canReview ? (
          done ? (
            <p className="text-sm font-medium text-maroon">
              ✓ Thanks! Your review has been saved.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <p className="text-sm font-medium text-ink">
                {myReview ? "Update your review" : "Rate this product"}
                <span className="ml-2 rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-maroon">
                  Verified Purchase
                </span>
              </p>
              <Stars value={rating} onChange={setRating} size={26} />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share how the fit, fabric and quality were…"
                className="w-full rounded-md border border-maroon/20 px-3 py-2 text-sm outline-none focus:border-maroon"
              />
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <button type="submit" disabled={busy || rating === 0} className="btn-primary disabled:opacity-50">
                {busy ? "Saving…" : myReview ? "Update Review" : "Submit Review"}
              </button>
            </form>
          )
        ) : (
          <p className="text-sm text-ink/70">
            You can rate this product once your order for it is delivered.
          </p>
        )}
      </div>

      {/* Reviews list */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-sm text-ink/50">Loading reviews…</p>
        ) : count === 0 ? (
          <p className="text-sm text-ink/50">
            No reviews yet. Be the first to review after your purchase.
          </p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="border-b border-maroon/10 pb-4 last:border-0">
              <div className="flex items-center gap-2">
                <Stars value={r.rating} size={14} />
                <span className="text-sm font-medium text-ink">{r.name}</span>
                {r.verified && (
                  <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-maroon">
                    Verified Purchase
                  </span>
                )}
              </div>
              {r.comment && (
                <p className="mt-1.5 text-sm text-ink/70">{r.comment}</p>
              )}
              <p className="mt-1 text-xs text-ink/40">
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
