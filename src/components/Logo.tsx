import Link from "next/link";
import Image from "next/image";

/**
 * VastraVedh header logo — uses the wide brand banner (public/logo-banner.png).
 * The banner is a very wide (~2.7:1) cover image. We render it whole
 * (object-contain, left-aligned) inside a large box so it takes up the full
 * left side of the header without cropping the monogram or wordmark.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="VastraVedh home"
      className="block shrink-0"
    >
      <div
        className={`relative ${
          compact
            ? "h-12 w-40"
            : "h-14 w-48 sm:h-16 sm:w-64 md:h-20 md:w-80 lg:h-24 lg:w-[26rem]"
        }`}
      >
        <Image
          src="/logo-banner.png"
          alt="VastraVedh — Trending Meets Elegance"
          fill
          priority
          sizes="(max-width: 640px) 192px, (max-width: 768px) 256px, (max-width: 1024px) 320px, 416px"
          className="object-contain object-left"
        />
      </div>
    </Link>
  );
}
