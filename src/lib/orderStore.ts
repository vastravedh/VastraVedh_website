import "server-only";
import { adminDb } from "./firebase/admin";
import type { OrderStatus } from "./orderStatus";

// Re-export status constants/types so existing server imports keep working.
export {
  ORDER_STAGES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "./orderStatus";

/**
 * Server-only order store, backed by the Firestore `orders` collection
 * (document id = order id). Powers the admin dashboard and analytics.
 */

export interface OrderItem {
  /** Product id — used to decrement per-size stock. Optional for legacy orders. */
  productId?: string;
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
  /** Set whenever the status changes; used to show a timeline history. */
  updatedAt?: string;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: "COD";
  status: OrderStatus;
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

/** Update an order's delivery status. Returns the updated order, or undefined. */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | undefined> {
  const ref = col().doc(id);
  const snap = await ref.get();
  if (!snap.exists) return undefined;
  const updatedAt = new Date().toISOString();
  await ref.update({ status, updatedAt });
  return { ...(snap.data() as Order), status, updatedAt };
}
