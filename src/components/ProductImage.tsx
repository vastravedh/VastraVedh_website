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

      {watermark && (
        <span className="pointer-events-none absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-cream/95 px-2 py-1 shadow-md ring-1 ring-gold/40 backdrop-blur-sm">
          <Image
            src="/logo.jpg"
            alt="VastraVedh"
            width={16}
            height={16}
            className="h-4 w-4 rounded-full object-cover"
          />
          <span className="font-serif text-[9px] font-bold leading-none text-maroon">
            Vastra<span className="text-gold-dark">Vedh</span>
          </span>
        </span>
      )}
    </>
  );
}
