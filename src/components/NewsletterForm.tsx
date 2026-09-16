"use client";

import { useState } from "react";

/**
 * "Stay in Style" newsletter sign-up. Saves the email via /api/subscribe so we
 * can email subscribers about new arrivals and offers.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
      } else {
        setError(data.error || "Could not subscribe. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <p className="mt-3 rounded-md bg-cream/10 px-3 py-2 text-sm font-medium text-gold">
        ✓ You&apos;re in! We&apos;ll email you about new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-3">
      <div className="flex overflow-hidden rounded-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full px-3 py-2 text-sm text-ink outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="bg-gold px-4 text-sm font-semibold text-ink hover:bg-gold-dark disabled:opacity-60"
        >
          {busy ? "…" : "Join"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs font-medium text-gold">{error}</p>
      )}
    </form>
  );
}
