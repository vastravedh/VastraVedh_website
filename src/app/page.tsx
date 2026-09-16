import Link from "next/link";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import {
  catalogFeatured,
  catalogNewArrivals,
  catalogOutOfStock,
} from "@/lib/catalog";
import { getCategoryImages } from "@/lib/categoryImageStore";
import CategoryScroller from "@/components/CategoryScroller";
import HeroCarousel from "@/components/HeroCarousel";
import OutOfStockCard from "@/components/OutOfStockCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featured = await catalogFeatured();
  const newArrivals = await catalogNewArrivals();
  const outOfStock = await catalogOutOfStock();
  const categoryImages = await getCategoryImages();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon text-cream">
        <div className="container-px grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
              Festive Collection 2026
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-6xl">
              Trending Meets{" "}
              <span className="text-gold">Elegance</span>
            </h1>
            <p className="mt-4 max-w-md text-cream/80">
              Discover handpicked women&apos;s ethnic wear — from timeless
              sarees to statement lehengas. Crafted for the modern Indian woman.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/category/sarees" className="btn-gold">
                Shop Sarees
              </Link>
              <Link
                href="/category/lehengas"
                className="inline-flex items-center justify-center rounded-md border border-cream/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-cream hover:bg-cream/10"
              >
                Explore Lehengas
              </Link>
            </div>
          </div>
          <HeroCarousel categories={categories} categoryImages={categoryImages} />
        </div>
      </section>

      {/* Quick category strip — visible right under the hero so users
          immediately know what they can shop, no scrolling needed */}
      <section className="border-b border-maroon/10 bg-cream">
        <div className="container-px flex gap-3 overflow-x-auto py-4 no-scrollbar">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="flex flex-shrink-0 items-center rounded-full border border-maroon/20 bg-white px-4 py-2 text-sm font-medium text-maroon transition-colors hover:border-maroon hover:bg-maroon hover:text-cream"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Offers strip */}
      <section className="border-b border-maroon/10 bg-cream-dark">
        <div className="container-px grid grid-cols-2 gap-4 py-6 text-center text-sm md:grid-cols-4">
          <Feature title="Free Shipping" sub="On orders above ₹999" />
          <Feature title="Easy Returns" sub="7-day return policy" />
          <Feature title="Secure Payments" sub="100% protected" />
          <Feature title="COD Available" sub="Pay on delivery" />
        </div>
      </section>

      {/* Categories */}
      <section className="container-px py-14">
        <SectionHeading
          title="Shop by Category"
          subtitle="Find your perfect look across our curated collections"
        />
        <CategoryScroller categories={categories} categoryImages={categoryImages} />
      </section>

      {/* Bestsellers */}
      <section className="container-px py-6">
        <SectionHeading
          title="Bestsellers"
          subtitle="Loved by thousands of VastraVedh customers"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo banner */}
      <section className="container-px py-14">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-maroon to-maroon-light px-8 py-12 text-center text-cream">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">
            Extra Love by VastraVedh
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
            Plus Size Collection · 3XL to 6XL
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Signature designs made to fit and flatter every body.
          </p>
          <Link href="/category/plus-size" className="btn-gold mt-6">
            Shop Plus Size
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-px pb-16">
        <SectionHeading
          title="New Arrivals"
          subtitle="Fresh styles just landed"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Out of Stock — with Notify Me email capture */}
      {outOfStock.length > 0 && (
        <section className="container-px pb-16">
          <SectionHeading
            title="Out of Stock"
            subtitle="Sold out for now — get notified when these are back"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {outOfStock.map((p) => (
              <OutOfStockCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 text-center">
      <h2 className="font-serif text-3xl font-bold text-maroon">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
      <div className="mx-auto mt-3 h-0.5 w-16 bg-gold" />
    </div>
  );
}

function Feature({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <p className="font-semibold text-maroon">{title}</p>
      <p className="text-xs text-ink/60">{sub}</p>
    </div>
  );
}
