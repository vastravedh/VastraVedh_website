"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Sticky action bar shown on a draft preview. Confirming publishes the
 * product (sets status=published) so it becomes visible to shoppers.
 */
export default function PublishBar({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const publish = async () => {
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/product/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not publish. Please try again.");
    }
  };

  return (
    <div className="sticky bottom-0 z-40 border-t border-maroon/15 bg-cream/95 backdrop-blur">
      <div className="container-px flex flex-wrap items-center justify-between gap-3 py-4">
        <p className="text-sm text-ink/70">
          Ready to make <span className="font-semibold text-ink">{name}</span>{" "}
          visible to customers?
        </p>
        <div className="flex items-center gap-3">
          {error && <span className="text-sm font-medium text-maroon">{error}</span>}
          <button
            onClick={publish}
            disabled={busy}
            className="btn-primary disabled:opacity-50"
          >
            {busy ? "Publishing…" : "Confirm & Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
