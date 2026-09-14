"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { initAnalytics } from "@/lib/firebase/client";

/**
 * Initialises Firebase Analytics in the browser and logs a `page_view` on every
 * client-side navigation. Safe to render everywhere: it no-ops on the server,
 * when Analytics is unsupported, or when no measurementId is configured.
 */
export default function FirebaseAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const page_path = query ? `${pathname}?${query}` : pathname;
    initAnalytics().then((analytics) => {
      if (!analytics) return;
      logEvent(analytics, "page_view", {
        page_path,
        page_location: typeof window !== "undefined" ? window.location.href : undefined,
        page_title: typeof document !== "undefined" ? document.title : undefined,
      });
    });
  }, [pathname, searchParams]);

  return null;
}
