import "server-only";
import { adminDb } from "./firebase/admin";
import { getOrdersByPhones } from "./orderStore";
import { getUser } from "./userStore";

/**
 * Product reviews, backed by the Firestore `reviews` collection. Reviews are
 * "verified purchase" only: a user may review a product just once, and only if
 * they have a *delivered* order containing that product. This mirrors how
 * Amazon/Myntra gate reviews to real buyers.
 *
 * Doc id = `${productId}__${email}` so each user can review a product once.
 */

export interface Review {
  id: string;
  productId: string; // we key by product slug
  email: string;
  name: string;
  rating: number; // 1..5
  comment: string;
  createdAt: string;
  verified: boolean;
}

const col = () => adminDb.collection("reviews");

const docId = (productId: string, email: string) =>
  `${productId}__${email.toLowerCase()}`;

/**
 * Has this user purchased (and had delivered) the given product? We match the
 * user's phone numbers to delivered orders that contain the product name/slug.
 * Orders store item name + productId; we match on either.
 */
export async function hasPurchased(
  email: string,
  productId: string,
  productName?: string
): Promise<boolean> {
  const user = await getUser(email);
  const phones = [
    user?.phone ?? "",
    ...(user?.addresses ?? []).map((a) => a.phone),
  ].filter(Boolean);
  if (phones.length === 0) return false;

  const orders = await getOrdersByPhones(phones);
  return orders.some(
    (o) =>
      o.status === "delivered" &&
      o.items.some(
        (it) =>
          it.slug === productId ||
          it.productId === productId ||
          (productName && it.name === productName)
      )
  );
}

export async function getReviews(productId: string): Promise<Review[]> {
  const snap = await col()
    .where("productId", "==", productId)
    .get();
  const list = snap.docs.map((d) => d.data() as Review);
  // newest first
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getUserReview(
  productId: string,
  email: string
): Promise<Review | undefined> {
  const snap = await col().doc(docId(productId, email)).get();
  return snap.exists ? (snap.data() as Review) : undefined;
}

/** Average rating + count for a product (from real reviews). */
export async function getRatingSummary(
  productId: string
): Promise<{ average: number; count: number }> {
  const reviews = await getReviews(productId);
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return {
    average: Math.round((sum / reviews.length) * 10) / 10,
    count: reviews.length,
  };
}

export async function upsertReview(input: {
  productId: string;
  email: string;
  name: string;
  rating: number;
  comment: string;
  verified: boolean;
}): Promise<Review> {
  const id = docId(input.productId, input.email);
  const review: Review = {
    id,
    productId: input.productId,
    email: input.email.toLowerCase(),
    name: input.name || "VastraVedh Customer",
    rating: Math.min(5, Math.max(1, Math.round(input.rating))),
    comment: input.comment.slice(0, 1000),
    createdAt: new Date().toISOString(),
    verified: input.verified,
  };
  await col().doc(id).set(review);
  return review;
}
