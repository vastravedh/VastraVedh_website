"use client";

import { useState } from "react";

/**
 * Contact Us form. Posts the customer's name, email, phone, subject and
 * message to /api/contact, which records it for the admin to follow up on.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setDone(true);
      } else {
        setError(data.error || "Could not send your message. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-maroon/15 bg-white p-8 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl text-maroon">
          ✓
        </div>
        <h3 className="font-serif text-2xl font-bold text-maroon">
          Thank you for reaching out
        </h3>
        <p className="mt-2 text-sm text-ink/70">
          We&apos;ve received your message and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setName("");
            setEmail("");
            setPhone("");
            setSubject("");
            setMessage("");
          }}
          className="btn-gold mt-6"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field =
    "w-full rounded-md border border-maroon/25 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-maroon";

  return (
    <form
      onSubmit={submit}
      className="rounded-xl border border-maroon/15 bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Name <span className="text-maroon">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            Email <span className="text-maroon">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Optional"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink">
            Subject
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="How can we help?"
            className={field}
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message <span className="text-maroon">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more about your query…"
          className={`${field} resize-y`}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-maroon/5 px-3 py-2 text-sm font-medium text-maroon">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-50">
        {busy ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
