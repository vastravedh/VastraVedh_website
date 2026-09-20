"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/format";
import GoogleSignInButton from "@/components/GoogleSignInButton";

/* =========================================================================
   Top-level: show the login card when logged out, the dashboard when in.
   ========================================================================= */
export default function AccountClient() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container-px py-24 text-center text-ink/50">Loading…</div>
    );
  }
  return user ? <Dashboard /> : <LoginCard />;
}

/* =========================================================================
   Login — email OTP
   ========================================================================= */
function LoginCard() {
  const { refresh } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("code");
      } else {
        setError(data.error || "Could not send the code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok) {
        await refresh();
      } else {
        setError(data.error || "Invalid code.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const field =
    "w-full rounded-md border border-maroon/20 px-3 py-2.5 text-sm outline-none focus:border-maroon";

  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-card">
        <h1 className="text-center font-serif text-2xl font-bold text-maroon">
          Welcome to VastraVedh
        </h1>
        <p className="mt-1 text-center text-sm text-ink/60">
          Sign in or create your account with your email — we&apos;ll send a
          one-time code.
        </p>

        {step === "email" && (
          <>
            <div className="mt-6">
              <GoogleSignInButton />
            </div>
            <div className="my-5 flex items-center gap-3 text-xs text-ink/40">
              <span className="h-px flex-1 bg-maroon/10" />
              or continue with email
              <span className="h-px flex-1 bg-maroon/10" />
            </div>
          </>
        )}

        {step === "email" ? (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={field}
              />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? "Sending code…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-6 space-y-4">
            <p className="text-sm text-ink/70">
              Enter the 6-digit code sent to <strong>{email}</strong>. Check
              your inbox and spam folder.
            </p>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                One-time code
              </label>
              <input
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className={`${field} tracking-[0.4em]`}
              />
            </div>
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
              {busy ? "Verifying…" : "Verify & Sign In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError("");
              }}
              className="w-full text-center text-sm text-maroon hover:underline"
            >
              ← Use a different email
            </button>
          </form>
        )}

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-ink/50 hover:text-maroon"
        >
          ← Back to shopping
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   Dashboard — tabbed: Orders, Account (addresses), Wishlist, Track Order
   ========================================================================= */
type Tab = "orders" | "account" | "wishlist" | "track";

function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("orders");

  const tabs: { key: Tab; label: string }[] = [
    { key: "orders", label: "Orders" },
    { key: "account", label: "Account" },
    { key: "wishlist", label: "Wishlist" },
    { key: "track", label: "Track Order" },
  ];

  return (
    <div className="container-px py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-maroon">
            My Account
          </h1>
          <p className="text-sm text-ink/60">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-maroon/30 px-4 py-2 text-sm font-medium text-maroon hover:bg-maroon hover:text-cream"
        >
          Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-maroon/10 no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? "border-gold text-maroon"
                : "border-transparent text-ink/60 hover:text-maroon"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && <OrdersTab />}
        {tab === "account" && <AddressesTab />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "track" && <TrackTab />}
      </div>
    </div>
  );
}

/* ---------- Orders ---------- */
type MyOrder = {
  id: string;
  createdAt: string;
  statusLabel: string;
  delivered: boolean;
  total: number;
  items: { name: string; size: string; quantity: number; slug?: string }[];
};

function OrdersTab() {
  const [orders, setOrders] = useState<MyOrder[] | null>(null);

  useEffect(() => {
    fetch("/api/account/orders", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]));
  }, []);

  if (orders === null) return <p className="text-ink/50">Loading orders…</p>;
  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        sub="Orders you place will appear here. We match them to the phone number on your saved addresses."
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-lg border border-maroon/10 bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-maroon">#{o.id}</p>
            <span className="rounded-full bg-cream-dark px-3 py-0.5 text-xs font-medium text-maroon">
              {o.statusLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink/50">
            {new Date(o.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink/70">
            {o.items.map((it, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-2">
                <span>{it.name} · {it.size} · Qty {it.quantity}</span>
                {o.delivered && it.slug && (
                  <Link
                    href={`/product/${it.slug}#reviews`}
                    className="text-xs font-medium text-gold-dark hover:underline"
                  >
                    ★ Rate this item
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm font-bold text-maroon">{formatINR(o.total)}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Addresses ---------- */
type Addr = {
  id: string;
  name: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  pincode: string;
  isDefault?: boolean;
};

function AddressesTab() {
  const [addresses, setAddresses] = useState<Addr[] | null>(null);
  const [adding, setAdding] = useState(false);

  const load = () =>
    fetch("/api/account/address", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setAddresses(d.addresses ?? []))
      .catch(() => setAddresses([]));

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    await fetch("/api/account/address", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  if (addresses === null) return <p className="text-ink/50">Loading…</p>;

  return (
    <div>
      <div className="space-y-3">
        {addresses.length === 0 && !adding && (
          <EmptyState title="No saved addresses" sub="Add an address for faster checkout." />
        )}
        {addresses.map((a) => (
          <div key={a.id} className="rounded-lg border border-maroon/10 bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm">
                <p className="font-medium text-ink">
                  {a.name}
                  {a.isDefault && (
                    <span className="ml-2 rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-maroon">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-ink/70">{a.phone}</p>
                <p className="mt-1 text-ink/60">
                  {a.address}{a.landmark ? `, ${a.landmark}` : ""}, {a.city} {a.pincode}
                </p>
              </div>
              <button
                onClick={() => remove(a.id)}
                className="text-xs font-medium text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding ? (
        <AddressForm
          onDone={() => {
            setAdding(false);
            load();
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button onClick={() => setAdding(true)} className="btn-primary mt-4">
          + Add Address
        </button>
      )}
    </div>
  );
}

function AddressForm({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [f, setF] = useState({ name: "", phone: "", address: "", landmark: "", city: "Hyderabad", pincode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/account/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) onDone();
    else setError(data.error || "Could not save.");
  };

  const field = "w-full rounded-md border border-maroon/20 px-3 py-2.5 text-sm outline-none focus:border-maroon";

  return (
    <form onSubmit={save} className="mt-4 space-y-3 rounded-lg border border-maroon/15 bg-white p-4 shadow-card">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={field} placeholder="Name" value={f.name} onChange={(e) => set("name", e.target.value.slice(0, 30))} required />
        <input className={field} inputMode="numeric" maxLength={10} placeholder="Phone" value={f.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} required />
      </div>
      <textarea className={field} rows={2} placeholder="Address" value={f.address} onChange={(e) => set("address", e.target.value)} required />
      <div className="grid gap-3 sm:grid-cols-3">
        <input className={field} placeholder="Landmark (optional)" value={f.landmark} onChange={(e) => set("landmark", e.target.value)} />
        <input className={field} placeholder="City" value={f.city} onChange={(e) => set("city", e.target.value)} required />
        <input className={field} inputMode="numeric" maxLength={6} placeholder="Pincode" value={f.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))} required />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
          {busy ? "Saving…" : "Save Address"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-md border border-maroon/30 px-4 py-2 text-sm text-maroon hover:bg-maroon/5">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ---------- Wishlist ---------- */
function WishlistTab() {
  const { wishlist } = useAuth();
  if (wishlist.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        sub="Tap the heart on any product to save it here."
      />
    );
  }
  return (
    <div>
      <p className="mb-3 text-sm text-ink/60">
        {wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}
      </p>
      <ul className="space-y-2">
        {wishlist.map((slug) => (
          <li key={slug} className="rounded-lg border border-maroon/10 bg-white p-3 shadow-card">
            <Link href={`/product/${slug}`} className="text-sm font-medium text-maroon hover:underline">
              {slug}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-ink/40">
        Tip: open any saved item to view it and add to cart.
      </p>
    </div>
  );
}

/* ---------- Track Order ---------- */
function TrackTab() {
  return (
    <EmptyState
      title="Track your order"
      sub="Open the full tracker to see delivery progress."
      action={
        <Link href="/track" className="btn-primary mt-4">
          Go to Track Order
        </Link>
      }
    />
  );
}

function EmptyState({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-maroon/20 bg-white/60 p-10 text-center">
      <p className="font-serif text-lg font-semibold text-maroon">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{sub}</p>
      {action}
    </div>
  );
}
