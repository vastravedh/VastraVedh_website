import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Server-only store for shopper accounts, backed by the Firestore `users`
 * collection (doc id = lower-cased email). Holds the user's profile, saved
 * addresses and wishlist. Auth is passwordless (email OTP), so there's no
 * password stored here.
 */

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  email: string;
  name?: string;
  phone?: string;
  createdAt: string;
  addresses: Address[];
  wishlist: string[]; // product ids/slugs
}

const col = () => adminDb.collection("users");

function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/** Get a user by email, creating a blank record on first sign-in. */
export async function getOrCreateUser(email: string): Promise<User> {
  const id = email.trim().toLowerCase();
  const ref = col().doc(id);
  const snap = await ref.get();
  if (snap.exists) return snap.data() as User;

  const user: User = {
    email: id,
    createdAt: new Date().toISOString(),
    addresses: [],
    wishlist: [],
  };
  await ref.set(user);
  return user;
}

export async function getUser(email: string): Promise<User | undefined> {
  const snap = await col().doc(email.trim().toLowerCase()).get();
  return snap.exists ? (snap.data() as User) : undefined;
}

export async function updateProfile(
  email: string,
  patch: { name?: string; phone?: string }
): Promise<void> {
  const clean = stripUndefined(patch);
  await col().doc(email.trim().toLowerCase()).set(clean, { merge: true });
}

/* ---------- Addresses ---------- */

export async function addAddress(
  email: string,
  address: Omit<Address, "id">
): Promise<Address> {
  const id = email.trim().toLowerCase();
  const ref = col().doc(id);
  const user = await getOrCreateUser(id);
  const newAddr: Address = {
    ...address,
    id: `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
  };
  const addresses = [...user.addresses];
  // First address becomes default automatically.
  if (addresses.length === 0 || newAddr.isDefault) {
    addresses.forEach((a) => (a.isDefault = false));
    newAddr.isDefault = true;
  }
  addresses.push(newAddr);
  await ref.set({ addresses: stripUndefined(addresses) }, { merge: true });
  return newAddr;
}

export async function deleteAddress(email: string, addressId: string): Promise<void> {
  const id = email.trim().toLowerCase();
  const ref = col().doc(id);
  const user = await getOrCreateUser(id);
  let addresses = user.addresses.filter((a) => a.id !== addressId);
  // If we removed the default, promote the first remaining address.
  if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
    addresses = addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
  }
  await ref.set({ addresses: stripUndefined(addresses) }, { merge: true });
}

/* ---------- Wishlist ---------- */

export async function toggleWishlist(
  email: string,
  productId: string
): Promise<{ wishlist: string[]; added: boolean }> {
  const id = email.trim().toLowerCase();
  const ref = col().doc(id);
  const user = await getOrCreateUser(id);
  const has = user.wishlist.includes(productId);
  const wishlist = has
    ? user.wishlist.filter((p) => p !== productId)
    : [...user.wishlist, productId];
  await ref.set({ wishlist }, { merge: true });
  return { wishlist, added: !has };
}
