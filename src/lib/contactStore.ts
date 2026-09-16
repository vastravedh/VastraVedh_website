import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Server-only store for "Contact Us" messages, backed by the Firestore
 * `contactMessages` collection. The admin can read these and reply to
 * customers who reach out through the contact page.
 */

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
  handled: boolean;
}

const col = () => adminDb.collection("contactMessages");

export async function addContactMessage(
  input: Omit<ContactMessage, "id" | "createdAt" | "handled">
): Promise<void> {
  const id = `c-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const doc: ContactMessage = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    subject: input.subject,
    message: input.message,
    createdAt: new Date().toISOString(),
    handled: false,
  };
  // Firestore rejects undefined values; strip them.
  const clean = JSON.parse(JSON.stringify(doc)) as ContactMessage;
  await col().doc(id).set(clean);
}

/** All contact messages, newest first. */
export async function getContactMessages(): Promise<ContactMessage[]> {
  const snap = await col().orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as ContactMessage);
}
