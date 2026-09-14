import "server-only";
import { adminDb } from "./firebase/admin";

/**
 * Server-only order store, backed by the Firestore `orders` collection
 * (document id = order id). Powers the admin dashboard and analytics.
 */

export interface OrderItem {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  notes?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: "COD";
  status: "confirmed";
}

const col = () => adminDb.collection("orders");

/** Firestore rejects `undefined` fields; strip them before writing. */
function stripUndefined<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export async function saveOrder(order: Order): Promise<void> {
  await col().doc(order.id).set(stripUndefined(order));
}

export async function getOrders(): Promise<Order[]> {
  const snap = await col().orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as Order);
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const snap = await col().doc(id).get();
  return snap.exists ? (snap.data() as Order) : undefined;
}
