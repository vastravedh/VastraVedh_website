/**
 * Order delivery status constants and labels. Kept in a non-server module so
 * both server code (orderStore) and client components (status dropdown,
 * tracking timeline) can import them safely.
 */

/**
 * Delivery lifecycle. Orders progress through these stages in order.
 * `cancelled` is a terminal side-state the admin can set at any time.
 */
export type OrderStatus =
  | "confirmed"
  | "assigned"
  | "picked"
  | "delivered"
  | "cancelled";

/** Ordered stages shown on the tracking timeline (excludes `cancelled`). */
export const ORDER_STAGES: OrderStatus[] = [
  "confirmed",
  "assigned",
  "picked",
  "delivered",
];

/** Human-friendly labels for each status. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  confirmed: "Order Confirmed",
  assigned: "Assigned to Delivery Partner",
  picked: "Delivery Partner Picked",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
