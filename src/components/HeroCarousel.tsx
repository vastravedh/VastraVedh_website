"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Category } from "@/data/types";

type Slide = {
  slug: string;
  name: string;
  image: string;
};

/**
 * Auto-scrolling hero carousel. Shows one image per category, advances
 * automatically, and lets the user jump to any slide via pagination dots.
 * Clicking the active slide navigates to that category's page.
 */
export default function HeroCarousel({
  categories,
  categoryImages,
  interval = 3500,
}: {
  categories: Category[];
  categoryImages: Record<string, string>;
  interval?: number;
}) {
  const slides: Slide[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    image: categoryImages[c.slug] ?? c.image,
  }));

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  );

  // Auto-advance on a timer; pause on hover/focus so users can read.
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || count <= 1) return;
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count, interval]);

  if (count === 0) return null;

  return (
    <div
      className="group relative block aspect-[4/5] overflow-hidden rounded-lg md:aspect-[3/4]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((s, i) => (
        <Link
          key={s.slug}
          href={`/category/${s.slug}`}
          aria-label={`Shop ${s.name}`}
          aria-hidden={i !== index}
          tabIndex={i === index ? 0 : -1}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ProductImage
            src={s.image}
            alt={`VastraVedh ${s.name} collection`}
            priority={i === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </Link>
      ))}

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-label={`Go to ${s.name} slide`}
            aria-current={i === index}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === index
                ? "w-6 bg-gold"
                : "w-2 bg-cream/60 hover:bg-cream"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
