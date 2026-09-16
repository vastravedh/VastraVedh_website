import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import {
  updateOrderStatus,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/orderStore";

export const runtime = "nodejs";

const VALID = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

/** Update an order's delivery status. Admin-only. */
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id).trim() : "";
  const status = body?.status ? String(body.status).trim() : "";

  if (!id) {
    return NextResponse.json(
      { ok: false, error: "Missing order id." },
      { status: 400 }
    );
  }
  if (!VALID.includes(status as OrderStatus)) {
    return NextResponse.json(
      { ok: false, error: "Invalid status." },
      { status: 400 }
    );
  }

  const updated = await updateOrderStatus(id, status as OrderStatus);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, order: updated });
}
