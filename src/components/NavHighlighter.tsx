"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { categories } from "@/data/categories";

/**
 * On the /search page, highlights the nav tab whose category matches the
 * search query (e.g. searching "dresses" highlights the DRESSES tab).
 * Purely additive: it toggles the active classes on the existing tabs.
 */
export default function NavHighlighter() {
  const pathname = usePathname();
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim().toLowerCase();

  useEffect(() => {
    const desktop = Array.from(
      document.querySelectorAll<HTMLElement>(".nav-tab[data-cat]")
    );
    const mobile = Array.from(
      document.querySelectorAll<HTMLElement>(".nav-tab-m[data-cat]")
    );
    const all = [...desktop, ...mobile];

    // Clear any search-driven highlight first.
    for (const el of all) {
      if (el.dataset.searchActive === "1") {
        el.dataset.searchActive = "0";
        el.classList.remove("text-maroon");
        el.classList.remove("border-gold");
        el.classList.remove("bg-maroon/10");
        if (el.classList.contains("nav-tab")) {
          el.classList.add("border-transparent", "text-ink");
        } else {
          el.classList.add("text-ink");
        }
      }
    }

    if (pathname !== "/search" || !q) return;

    // Find the category matching the query (by slug or name).
    const match = categories.find(
      (c) =>
        c.slug === q ||
        c.name.toLowerCase() === q ||
        c.name.toLowerCase().startsWith(q) ||
        q.startsWith(c.name.toLowerCase())
    );
    if (!match) return;

    for (const el of all) {
      if (el.dataset.cat !== match.slug) continue;
      el.dataset.searchActive = "1";
      el.classList.remove("border-transparent", "text-ink");
      el.classList.add("text-maroon");
      if (el.classList.contains("nav-tab")) {
        el.classList.add("border-gold");
      } else {
        el.classList.add("bg-maroon/10");
      }
    }
  }, [pathname, q]);

  return null;
}
