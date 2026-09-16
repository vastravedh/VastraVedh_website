import { NextResponse } from "next/server";
import { getOrder } from "@/lib/orderStore";

export const runtime = "nodejs";

/**
 * Public order-tracking lookup. To protect customer data, the caller must
 * provide both the order id and the phone number used on the order. Only a
 * minimal, non-sensitive view of the order is returned.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id).trim() : "";
  const phone = body?.phone ? String(body.phone).replace(/\D/g, "") : "";

  if (!id || !phone) {
    return NextResponse.json(
      { ok: false, error: "Enter your order ID and phone number." },
      { status: 400 }
    );
  }

  const order = await getOrder(id);
  const orderPhone = order ? String(order.customer.phone).replace(/\D/g, "") : "";

  // Same error for "not found" and "phone mismatch" so we don't leak which
  // order ids exist.
  if (!order || orderPhone !== phone) {
    return NextResponse.json(
      { ok: false, error: "No order found with that ID and phone number." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? null,
      total: order.total,
      city: order.customer.city,
      items: order.items.map((i) => ({
        name: i.name,
        size: i.size,
        quantity: i.quantity,
      })),
    },
  });
}
