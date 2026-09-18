"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Heart toggle to save a product to the logged-in user's wishlist. If the user
 * isn't signed in, it sends them to the account page to log in.
 */
export default function WishlistButton({
  productId,
  className = "",
  size = 20,
}: {
  /** Stable product key stored in the wishlist (we use the slug). */
  productId: string;
  className?: string;
  size?: number;
}) {
  const { user, isWishlisted, toggleWishlist } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const active = isWishlisted(productId);

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/account");
      return;
    }
    setBusy(true);
    await toggleWishlist(productId);
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex items-center justify-center rounded-full bg-white/90 p-2 shadow-md backdrop-blur transition hover:bg-white disabled:opacity-60 ${className}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? "#7B0F2B" : "none"}
        stroke={active ? "#7B0F2B" : "#7B0F2B"}
        strokeWidth="2"
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
