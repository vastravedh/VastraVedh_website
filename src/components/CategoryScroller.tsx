"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Category } from "@/data/types";

/**
 * Horizontal, scrollable showcase of every category. Each card shows a
 * single image and links to that category's page. Auto-scrolls continuously,
 * pauses on hover/touch, and includes left/right arrow controls on larger
 * screens plus native swipe/scroll on touch.
 */
export default function CategoryScroller({
  categories,
  categoryImages,
}: {
  categories: Category[];
  categoryImages: Record<string, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  // When true, the auto-scroll loop is suspended (hover, touch, focus).
  const pausedRef = useRef(false);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Scroll by roughly the visible width so it feels like paging.
    const amount = Math.max(track.clientWidth * 0.8, 240);
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  // Continuous auto-scroll. Advances the track a little on each tick and loops
  // back to the start once it reaches the end. Pauses while the user is
  // interacting (hover / touch / focus) and respects reduced-motion settings.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const STEP = 1; // px per tick
    const TICK = 20; // ms between ticks
    const id = setInterval(() => {
      if (pausedRef.current) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;
      if (track.scrollLeft >= maxScroll - 1) {
        // Reached the end — jump back to the start to loop seamlessly.
        track.scrollTo({ left: 0, behavior: "auto" });
      } else {
        track.scrollLeft += STEP;
      }
    }, TICK);

    return () => clearInterval(id);
  }, [categories.length]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      className="relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {/* Left arrow */}
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scrollByCards(-1)}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-maroon/20 bg-white/90 p-2 text-maroon shadow-md backdrop-blur transition hover:bg-maroon hover:text-cream md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right arrow */}
      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scrollByCards(1)}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-maroon/20 bg-white/90 p-2 text-maroon shadow-md backdrop-blur transition hover:bg-maroon hover:text-cream md:flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar md:px-10"
      >
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            aria-label={`Shop ${c.name}`}
            className="group relative aspect-[3/4] w-40 flex-shrink-0 snap-start overflow-hidden rounded-lg sm:w-48 md:w-56"
          >
            <ProductImage
              src={categoryImages[c.slug] ?? c.image}
              alt={c.name}
              sizes="(max-width: 640px) 40vw, (max-width: 768px) 30vw, 224px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <span className="absolute bottom-3 left-0 right-0 text-center font-serif text-lg font-semibold text-cream">
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
