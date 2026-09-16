import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Server-only store for "notify me when back in stock" requests, backed by the
 * Firestore `notifyRequests` collection. The admin can export these emails and
 * alert customers once a product/size is restocked.
 */

export interface NotifyRequest {
  id: string;
  email: string;
  productId?: string;
  slug?: string;
  name?: string;
  size?: string;
  createdAt: string;
  notified: boolean;
}

const col = () => adminDb.collection("notifyRequests");

export async function addNotifyRequest(
  input: Omit<NotifyRequest, "id" | "createdAt" | "notified">
): Promise<void> {
  const id = `n-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const doc: NotifyRequest = {
    id,
    email: input.email,
    productId: input.productId,
    slug: input.slug,
    name: input.name,
    size: input.size,
    createdAt: new Date().toISOString(),
    notified: false,
  };
  // Firestore rejects undefined values; strip them.
  const clean = JSON.parse(JSON.stringify(doc)) as NotifyRequest;
  await col().doc(id).set(clean);
}

/** All outstanding (not yet notified) requests, newest first. */
export async function getNotifyRequests(): Promise<NotifyRequest[]> {
  const snap = await col().orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as NotifyRequest);
}
