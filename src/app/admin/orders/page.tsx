import AdminHeader from "../AdminHeader";
import { getOrders, ORDER_STATUS_LABELS } from "@/lib/orderStore";
import { formatINR } from "@/lib/format";
import OrderStatusControl from "./OrderStatusControl";

export const metadata = { title: "Orders — VastraVedh Admin" };
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <h1 className="font-serif text-2xl font-bold text-maroon">Orders</h1>
        <p className="mt-1 text-sm text-ink/60">
          View orders and update the delivery status. Customers see this
          progress on the Track Order page.
        </p>

        {orders.length === 0 ? (
          <p className="mt-10 text-center text-ink/50">No orders yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-lg border border-maroon/10 bg-white p-4 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-maroon">#{o.id}</p>
                    <p className="text-xs text-ink/50">
                      {formatDate(o.createdAt)} · {o.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-maroon">
                      {formatINR(o.total)}
                    </p>
                    <p className="text-xs text-ink/50">
                      {ORDER_STATUS_LABELS[o.status] ?? o.status}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 border-t border-maroon/10 pt-3 sm:grid-cols-2">
                  <div className="text-sm">
                    <p className="font-medium text-ink">{o.customer.name}</p>
                    <p className="text-ink/70">{o.customer.phone}</p>
                    <p className="mt-1 text-ink/60">
                      {o.customer.address}
                      {o.customer.landmark ? `, ${o.customer.landmark}` : ""},{" "}
                      {o.customer.city} {o.customer.pincode}
                    </p>
                    {o.customer.notes && (
                      <p className="mt-1 text-xs italic text-ink/50">
                        Note: {o.customer.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-sm">
                    <ul className="space-y-1">
                      {o.items.map((it, i) => (
                        <li key={i} className="text-ink/70">
                          {it.name} · {it.size} · Qty {it.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-3 border-t border-maroon/10 pt-3">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink/50">
                    Delivery status
                  </p>
                  <OrderStatusControl orderId={o.id} current={o.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
