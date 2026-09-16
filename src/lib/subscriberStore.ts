import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Server-only store for newsletter subscribers ("Stay in Style"), backed by
 * the Firestore `subscribers` collection. Doc id = the email address (lower-
 * cased) so the same email can't subscribe twice.
 *
 * These emails are used to announce new arrivals and offers. Actually sending
 * the emails requires an email provider (see notifyNewArrival()).
 */

export interface Subscriber {
  email: string;
  createdAt: string;
  /** Where they signed up from, e.g. "footer". */
  source?: string;
  active: boolean;
}

const col = () => adminDb.collection("subscribers");

/** Add a subscriber (idempotent). Re-subscribing reactivates the email. */
export async function addSubscriber(
  email: string,
  source = "footer"
): Promise<void> {
  const id = email.trim().toLowerCase();
  const doc: Subscriber = {
    email: id,
    createdAt: new Date().toISOString(),
    source,
    active: true,
  };
  await col().doc(id).set(doc, { merge: true });
}

/** All active subscribers, newest first. */
export async function getSubscribers(): Promise<Subscriber[]> {
  const snap = await col().orderBy("createdAt", "desc").get();
  return snap.docs
    .map((d) => d.data() as Subscriber)
    .filter((s) => s.active !== false);
}

/**
 * Email all active subscribers about a new arrival. Uses the shared mailer,
 * which is a no-op until an email provider (RESEND_API_KEY) is configured — in
 * that case nothing is sent and `skipped` is true.
 */
export async function notifyNewArrival(product: {
  name: string;
  slug: string;
  price?: number;
  image?: string;
}): Promise<{ ok: boolean; sent: number; skipped?: boolean }> {
  const { sendEmail } = await import("./mailer");
  const subs = await getSubscribers();
  if (subs.length === 0) return { ok: true, sent: 0 };

  const url = `https://vastravedh.com/product/${product.slug}`;
  const priceLine =
    typeof product.price === "number"
      ? `<p style="color:#7B0F2B;font-weight:600">₹${product.price}</p>`
      : "";
  const imgTag = product.image
    ? `<img src="${product.image}" alt="${product.name}" width="320" style="border-radius:8px;max-width:100%"/>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;color:#2B1A1F">
      <h2 style="color:#7B0F2B">New at VastraVedh</h2>
      <p>Just landed — <strong>${product.name}</strong>.</p>
      ${imgTag}
      ${priceLine}
      <p><a href="${url}" style="display:inline-block;background:#7B0F2B;color:#F7F2E7;padding:10px 18px;border-radius:6px;text-decoration:none">Shop now</a></p>
      <p style="font-size:12px;color:#888">You're receiving this because you subscribed at vastravedh.com.</p>
    </div>`;

  const subject = `New arrival: ${product.name}`;
  let sent = 0;
  for (const s of subs) {
    const r = await sendEmail({ to: s.email, subject, html });
    if (r.skipped) {
      // Provider not configured — stop early, nothing will send.
      return { ok: true, sent: 0, skipped: true };
    }
    if (r.ok) sent++;
  }

  return { ok: true, sent };
}
