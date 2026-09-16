import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="mt-16 bg-maroon text-cream">
      <div className="container-px grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="inline-flex rounded-lg bg-cream/95 p-2">
            <Image
              src="/logo.jpg"
              alt="VastraVedh — Trending Meets Elegance"
              width={180}
              height={60}
              className="h-12 w-auto object-contain"
            />
          </span>
          <p className="mt-4 text-sm text-cream/80">
            Premium women&apos;s Indian ethnic wear, crafted with love and
            delivered to your door.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="hover:text-gold"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Help
          </h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="#" className="hover:text-gold">Track Order</Link></li>
            <li><Link href="#" className="hover:text-gold">Returns &amp; Exchange</Link></li>
            <li><Link href="#" className="hover:text-gold">Shipping Policy</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            Stay in Style
          </h4>
          <p className="text-sm text-cream/80">
            Subscribe for new arrivals and exclusive offers.
          </p>
          <form className="mt-3 flex overflow-hidden rounded-md">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 text-sm text-ink outline-none"
            />
            <button
              type="submit"
              className="bg-gold px-4 text-sm font-semibold text-ink hover:bg-gold-dark"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-4 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} VastraVedh. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gold">Privacy</Link>
            <Link href="#" className="hover:text-gold">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
