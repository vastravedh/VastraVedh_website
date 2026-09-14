import { NextResponse } from "next/server";
import { saveOrder, Order, OrderItem, Customer } from "@/lib/orderStore";
import { sendSms } from "@/lib/sms";
import { findCoupon } from "@/data/coupons";

export const runtime = "nodejs";

const OWNER_PHONE = process.env.OWNER_PHONE || "9063905840";
const HYD_DELIVERY_FEE = Number(process.env.HYD_DELIVERY_FEE || 49);

function money(n: number) {
  return `Rs.${n}`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const { customer, items, couponCode } = body as {
    customer: Customer;
    items: OrderItem[];
    couponCode?: string;
  };

  // Validate customer details
  const required: (keyof Customer)[] = [
    "name",
    "phone",
    "address",
    "city",
    "pincode",
  ];
  for (const f of required) {
    if (!customer?.[f] || String(customer[f]).trim() === "") {
      return NextResponse.json(
        { ok: false, error: `Please fill in your ${f}.` },
        { status: 400 }
      );
    }
  }
  const phone = String(customer.phone).replace(/\D/g, "");
  if (phone.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid 10-digit phone number." },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Your cart is empty." },
      { status: 400 }
    );
  }

  // Totals (recomputed server-side; never trust client math)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const coupon = couponCode ? findCoupon(couponCode) : undefined;
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const deliveryFee = HYD_DELIVERY_FEE;
  const total = subtotal - discount + deliveryFee;

  const order: Order = {
    id: `VV${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    customer: { ...customer, phone },
    items,
    subtotal,
    discount,
    couponCode: coupon?.code,
    deliveryFee,
    total,
    paymentMethod: "COD",
    status: "confirmed",
  };

  await saveOrder(order);

  // ---- SMS notifications ----
  const itemLines = items
    .map((i) => `${i.name} (${i.size}) x${i.quantity}`)
    .join(", ");

  const customerMsg =
    `VastraVedh: Order ${order.id} CONFIRMED (COD ${money(total)}). ` +
    `We will call you shortly and deliver within 1 hour (Hyderabad). ` +
    `Thank you for shopping with us! Trending Meets Elegance.`;

  const ownerMsg =
    `NEW ORDER ${order.id} | COD ${money(total)} | ` +
    `${customer.name}, ${phone} | ${customer.address}, ${customer.city} ${customer.pincode} | ` +
    `Items: ${itemLines}`;

  const sms = await Promise.all([
    sendSms(phone, customerMsg),
    sendSms(OWNER_PHONE, ownerMsg),
  ]);

  return NextResponse.json({ ok: true, orderId: order.id, sms });
}
