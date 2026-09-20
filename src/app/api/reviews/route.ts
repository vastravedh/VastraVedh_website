import { NextResponse } from "next/server";
import { currentUserEmail } from "@/lib/userAuth";
import { getUser } from "@/lib/userStore";
import {
  getReviews,
  getUserReview,
  hasPurchased,
  upsertReview,
} from "@/lib/reviewStore";

export const runtime = "nodejs";

/**
 * GET ?productId=slug[&name=...] — list reviews for a product, plus whether the
 * current user is eligible to review it (logged in + delivered purchase) and
 * their existing review if any.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = String(searchParams.get("productId") ?? "").trim();
  const productName = searchParams.get("name") ?? undefined;
  if (!productId) {
    return NextResponse.json({ ok: false, error: "Missing product." }, { status: 400 });
  }

  const reviews = await getReviews(productId);

  const email = await currentUserEmail();
  let canReview = false;
  let mine = undefined;
  if (email) {
    canReview = await hasPurchased(email, productId, productName ?? undefined);
    mine = await getUserReview(productId, email);
  }

  return NextResponse.json({
    ok: true,
    reviews: reviews.map((r) => ({
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      verified: r.verified,
    })),
    canReview,
    loggedIn: !!email,
    myReview: mine
      ? { rating: mine.rating, comment: mine.comment }
      : null,
  });
}

/** Submit/update a review. Requires login + a delivered purchase. */
export async function POST(req: Request) {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to leave a review." },
      { status: 401 }
    );
  }

  const b = await req.json().catch(() => null);
  const productId = String(b?.productId ?? "").trim();
  const productName = b?.productName ? String(b.productName) : undefined;
  const rating = Number(b?.rating);
  const comment = String(b?.comment ?? "").trim();

  if (!productId) {
    return NextResponse.json({ ok: false, error: "Missing product." }, { status: 400 });
  }
  if (!(rating >= 1 && rating <= 5)) {
    return NextResponse.json({ ok: false, error: "Please choose a rating (1–5)." }, { status: 400 });
  }

  const verified = await hasPurchased(email, productId, productName);
  if (!verified) {
    return NextResponse.json(
      {
        ok: false,
        error: "You can review this only after your order for it is delivered.",
      },
      { status: 403 }
    );
  }

  const user = await getUser(email);
  const name = user?.name || email.split("@")[0];

  const saved = await upsertReview({
    productId,
    email,
    name,
    rating,
    comment,
    verified: true,
  });

  return NextResponse.json({
    ok: true,
    review: { name: saved.name, rating: saved.rating, comment: saved.comment, verified: true },
  });
}
