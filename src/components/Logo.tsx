import Link from "next/link";
import Image from "next/image";

/**
 * VastraVedh header logo — uses the wide brand banner (public/logo-banner.png).
 * The banner is wide (≈3:1) with cream margins, so we render it inside a
 * fixed-height, clipped box that crops the empty sides and shows the
 * monogram + wordmark crisply.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="VastraVedh home"
      className="block shrink-0"
    >
      <div
        className={`relative overflow-hidden ${
          compact ? "h-11 w-40" : "h-14 w-52 sm:h-16 sm:w-64"
        }`}
      >
        <Image
          src="/logo-banner.png"
          alt="VastraVedh — Trending Meets Elegance"
          fill
          priority
          sizes="256px"
          className="object-cover object-center scale-[1.35]"
        />
      </div>
    </Link>
  );
}
