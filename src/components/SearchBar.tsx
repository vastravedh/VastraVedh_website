"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar({
  onSubmitted,
}: {
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState("");

  // Keep the field in sync when landing on /search?q=...
  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onSubmitted?.();
  };

  return (
    <form onSubmit={submit} className="relative mx-auto w-full max-w-xl">
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for suits, sarees, kurtas..."
        aria-label="Search products"
        className="w-full rounded-full border border-maroon/20 bg-white px-5 py-2.5 pr-12 text-sm outline-none focus:border-maroon"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-maroon/70 hover:bg-maroon/5 hover:text-maroon"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
