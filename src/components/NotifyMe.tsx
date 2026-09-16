"use client";

import { useState } from "react";

/**
 * "Notify me when back in stock" control. Shows a button that expands into a
 * small email form; on submit it records the request via /api/notify so the
 * admin can alert the customer once the item is restocked.
 */
export default function NotifyMe({
  productId,
  slug,
  name,
  size,
  compact = false,
}: {
  productId?: string;
  slug?: string;
  name?: string;
  size?: string;
  /** Smaller styling for cards. */
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    setError("");
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, productId, slug, name, size }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setDone(true);
    } else {
      setError(data.error || "Could not save. Try again.");
    }
  };

  if (done) {
    return (
      <p
        className={`font-medium text-maroon ${compact ? "text-xs" : "text-sm"}`}
      >
        ✓ We&apos;ll email you when it&apos;s back{size ? ` in ${size}` : ""}.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={
          compact
            ? "rounded-md border border-maroon/40 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-maroon hover:text-cream"
            : "rounded-md border border-maroon/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-maroon hover:bg-maroon hover:text-cream"
        }
      >
        Notify Me{size ? ` (${size})` : ""}
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col gap-2 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className={`rounded-md border border-maroon/30 px-3 outline-none focus:border-maroon ${
          compact ? "py-1.5 text-xs" : "py-2.5 text-sm"
        }`}
      />
      <button
        type="submit"
        disabled={busy}
        className={`rounded-md bg-maroon font-semibold text-cream hover:bg-maroon-dark disabled:opacity-50 ${
          compact ? "px-3 py-1.5 text-xs" : "px-5 py-2.5 text-sm"
        }`}
      >
        {busy ? "Saving…" : "Notify Me"}
      </button>
      {error && (
        <span className="self-center text-xs font-medium text-maroon">
          {error}
        </span>
      )}
    </form>
  );
}
