import { NextResponse } from "next/server";
import { currentUserEmail } from "@/lib/userAuth";
import { getUser } from "@/lib/userStore";
import { getOrdersByPhones, ORDER_STATUS_LABELS } from "@/lib/orderStore";

export const runtime = "nodejs";

/**
 * The logged-in user's orders. Since orders are keyed by phone (COD), we match
 * orders against the phone numbers on the user's profile and saved addresses.
 */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const user = await getUser(email);
  const phones = [
    user?.phone ?? "",
    ...(user?.addresses ?? []).map((a) => a.phone),
  ].filter(Boolean);

  const orders = await getOrdersByPhones(phones);

  return NextResponse.json({
    ok: true,
    orders: orders.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      status: o.status,
      statusLabel: ORDER_STATUS_LABELS[o.status] ?? o.status,
      total: o.total,
      items: o.items.map((i) => ({
        name: i.name,
        size: i.size,
        quantity: i.quantity,
      })),
    })),
  });
}
