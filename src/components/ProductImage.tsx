"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/placeholder.jpg";

/**
 * Product image with VastraVedh branding:
 *  - real photo, with an optional brand-colour tint overlay per variant
 *  - VV logo watermark badge overlaid on every image
 *  - falls back to /placeholder.jpg if the photo fails to load
 *
 * Wrap this in a `relative` container (it uses `fill`).
 */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  watermark = true,
  tint,
  className = "",
}: {
  src?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  watermark?: boolean;
  tint?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showSrc = !src || failed ? PLACEHOLDER : src;

  return (
    <>
      <Image
        src={showSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        onError={() => setFailed(true)}
      />

      {/* Brand-colour tint so each colour variant reads differently */}
      {tint && !failed && (
        <span
          className="pointer-events-none absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: tint }}
        />
      )}

      {/* VastraVedh monogram watermark in all four corners */}
      {watermark && (
        <>
          <CornerMark className="left-2 top-2" />
          <CornerMark className="right-2 top-2" />
          <CornerMark className="bottom-2 left-2" />
          <CornerMark className="bottom-2 right-2" />
        </>
      )}
    </>
  );
}

/** A single semi-transparent monogram watermark pinned to one corner. */
function CornerMark({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute flex items-center justify-center rounded-full bg-cream/85 p-0.5 shadow ring-1 ring-gold/30 backdrop-blur-sm ${className}`}
    >
      <Image
        src="/imgLogo.png"
        alt="VastraVedh"
        width={24}
        height={24}
        className="h-6 w-6 rounded-full object-cover opacity-90"
      />
    </span>
  );
}
