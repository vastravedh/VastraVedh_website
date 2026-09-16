"use client";

import { useState } from "react";
import { formatINR } from "@/lib/format";

type TrackedItem = { name: string; size: string; quantity: number };
type TrackedOrder = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  total: number;
  city: string;
  items: TrackedItem[];
};

const STAGES = [
  { key: "confirmed", label: "Order Confirmed", desc: "We've received your order." },
  { key: "assigned", label: "Assigned to Delivery Partner", desc: "A partner is assigned to your order." },
  { key: "picked", label: "Delivery Partner Picked", desc: "Your order is on the way." },
  { key: "delivered", label: "Delivered", desc: "Your order has reached you." },
] as const;

function stageIndex(status: string): number {
  return STAGES.findIndex((s) => s.key === status);
}

export default function TrackOrder() {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id.trim(), phone }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOrder(data.order as TrackedOrder);
      } else {
        setError(data.error || "Could not find your order.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-md border border-maroon/25 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-maroon";

  return (
    <div className="mx-auto max-w-2xl">
      <form
        onSubmit={submit}
        className="rounded-xl border border-maroon/15 bg-white p-6 shadow-card"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="oid" className="mb-1.5 block text-sm font-medium text-ink">
              Order ID
            </label>
            <input
              id="oid"
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              placeholder="VVXXXXXX"
              className={field}
              required
            />
          </div>
          <div>
            <label htmlFor="ophone" className="mb-1.5 block text-sm font-medium text-ink">
              Phone Number
            </label>
            <input
              id="ophone"
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              maxLength={10}
              className={field}
              required
            />
          </div>
        </div>
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn-primary mt-5 w-full sm:w-auto disabled:opacity-50">
          {busy ? "Tracking…" : "Track Order"}
        </button>
      </form>

      {order && <Timeline order={order} />}
    </div>
  );
}

function Timeline({ order }: { order: TrackedOrder }) {
  const cancelled = order.status === "cancelled";
  const current = stageIndex(order.status);

  return (
    <div className="mt-8 rounded-xl border border-maroon/15 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-maroon/10 pb-4">
        <div>
          <p className="font-serif text-lg font-bold text-maroon">#{order.id}</p>
          <p className="text-xs text-ink/50">Delivery to {order.city}</p>
        </div>
        <p className="text-sm font-semibold text-maroon">{formatINR(order.total)}</p>
      </div>

      {cancelled ? (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-center">
          <p className="font-semibold text-red-600">This order was cancelled</p>
          <p className="mt-1 text-sm text-ink/60">
            If this looks wrong, please contact us and we&apos;ll help.
          </p>
        </div>
      ) : (
        <ol className="mt-6 space-y-6">
          {STAGES.map((stage, i) => {
            const done = i < current;
            const active = i === current;
            const reached = i <= current;
            return (
              <li key={stage.key} className="relative flex gap-4">
                {/* Connector line */}
                {i < STAGES.length - 1 && (
                  <span
                    className={`absolute left-[15px] top-8 h-full w-0.5 ${
                      done ? "bg-maroon" : "bg-maroon/15"
                    }`}
                    aria-hidden
                  />
                )}
                {/* Dot */}
                <span
                  className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm ${
                    reached
                      ? "border-maroon bg-maroon text-cream"
                      : "border-maroon/20 bg-white text-maroon/30"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div className="pb-1">
                  <p
                    className={`font-medium ${
                      reached ? "text-maroon" : "text-ink/40"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="text-sm text-ink/60">{stage.desc}</p>
                  {active && order.updatedAt && (
                    <p className="mt-0.5 text-xs text-ink/40">
                      Updated {new Date(order.updatedAt).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 border-t border-maroon/10 pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink/50">
          Items
        </p>
        <ul className="space-y-1 text-sm text-ink/70">
          {order.items.map((it, i) => (
            <li key={i}>
              {it.name} · {it.size} · Qty {it.quantity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
