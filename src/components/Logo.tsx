import Link from "next/link";
import Image from "next/image";

/**
 * VastraVedh header logo — uses the real brand image at public/logo.jpg.
 */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center leading-none" aria-label="VastraVedh home">
      <Image
        src="/logo.jpg"
        alt="VastraVedh — Trending Meets Elegance"
        width={compact ? 150 : 200}
        height={compact ? 50 : 66}
        priority
        className="h-12 w-auto object-contain sm:h-16"
      />
    </Link>
  );
}
