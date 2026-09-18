"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { categories } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import NavHighlighter from "./NavHighlighter";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const homeActive = pathname === "/";

  // A category tab is "active" when you're on its category page.
  // (Search-based highlighting is layered on top via <NavHighlighter />,
  // which reads the ?q= query and marks the matching tab.)
  const categoryActive = (slug: string) =>
    pathname === `/category/${slug}` ||
    pathname.startsWith(`/category/${slug}/`);

  return (
    <header className="sticky top-0 z-50 bg-cream/95 shadow-sm backdrop-blur">
      {/* Announcement strip */}
      <div className="bg-maroon text-center text-xs font-medium text-cream">
        <div className="container-px py-2 tracking-wide">
          FLAT 50% OFF ON YOUR FIRST ORDER · FREE SHIPPING ABOVE ₹999
        </div>
      </div>

      {/* Main bar */}
      <div className="container-px flex items-center gap-3 py-2.5">
        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <MenuIcon />
        </button>

        <Logo />

        {/* Search (desktop/tablet) — centered, capped width */}
        <div className="mx-4 hidden flex-1 justify-center md:flex">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <Link
            href="/account"
            className="hidden items-center gap-1.5 text-sm font-medium text-ink hover:text-maroon sm:inline-flex"
          >
            <UserIcon />
            {user ? (user.name?.split(" ")[0] || "Account") : "Sign In"}
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1 text-ink hover:text-maroon"
            aria-label="Cart"
          >
            <CartIcon />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-bold text-cream">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Search (mobile) */}
      <div className="container-px pb-3 md:hidden">
        <Suspense fallback={null}>
          <SearchBar onSubmitted={() => setMobileOpen(false)} />
        </Suspense>
      </div>

      {/* Category nav (desktop) */}
      <nav className="hidden border-t border-maroon/10 lg:block">
        <div className="container-px flex items-center justify-center gap-8 py-2.5 text-sm font-medium uppercase tracking-wide">
          <Link
            href="/"
            className={`nav-tab border-b-2 pb-0.5 transition-colors ${
              homeActive
                ? "border-gold text-maroon"
                : "border-transparent text-ink hover:text-maroon"
            }`}
          >
            Home
          </Link>
          {categories.map((c) => {
            const href = `/category/${c.slug}`;
            const active = categoryActive(c.slug);
            return (
              <Link
                key={c.slug}
                href={href}
                data-cat={c.slug}
                aria-current={active ? "page" : undefined}
                className={`nav-tab border-b-2 pb-0.5 transition-colors ${
                  active
                    ? "border-gold text-maroon"
                    : "border-transparent text-ink hover:text-maroon"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-maroon/10 bg-cream lg:hidden">
          <div className="container-px flex flex-col py-2">
            <Link
              href="/"
              className={`nav-tab-m rounded px-2 py-2 text-sm font-medium ${
                homeActive
                  ? "bg-maroon/10 text-maroon"
                  : "text-ink hover:text-maroon"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            {categories.map((c) => {
              const href = `/category/${c.slug}`;
              const active = categoryActive(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={href}
                  data-cat={c.slug}
                  aria-current={active ? "page" : undefined}
                  className={`nav-tab-m rounded px-2 py-2 text-sm font-medium ${
                    active
                      ? "bg-maroon/10 text-maroon"
                      : "text-ink hover:text-maroon"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      {/* Highlights the matching category tab on the search page (?q=...) */}
      <Suspense fallback={null}>
        <NavHighlighter />
      </Suspense>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
