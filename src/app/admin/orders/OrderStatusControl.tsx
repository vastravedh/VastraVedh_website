"use client";

import { useState } from "react";
import { ORDER_STAGES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/orderStatus";

const OPTIONS: OrderStatus[] = [...ORDER_STAGES, "cancelled"];

/**
 * Dropdown to change an order's delivery status. Posts to /api/admin/order
 * and shows a brief saved/error state.
 */
export default function OrderStatusControl({
  orderId,
  current,
}: {
  orderId: string;
  current: OrderStatus;
}) {
  const [status, setStatus] = useState<OrderStatus>(current);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const update = async (next: OrderStatus) => {
    const prev = status;
    setStatus(next);
    setBusy(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setStatus(prev); // revert on failure
      setError(e instanceof Error ? e.message : "Could not update");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        disabled={busy}
        onChange={(e) => update(e.target.value as OrderStatus)}
        className="rounded-md border border-maroon/30 bg-white px-2 py-1.5 text-sm text-ink outline-none focus:border-maroon disabled:opacity-50"
      >
        {OPTIONS.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {busy && <span className="text-xs text-ink/50">Saving…</span>}
      {saved && <span className="text-xs font-medium text-green-600">Saved ✓</span>}
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}
