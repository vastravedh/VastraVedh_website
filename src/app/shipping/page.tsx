import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping Policy — VastraVedh",
  description:
    "Learn about VastraVedh delivery: currently serving Hyderabad, free delivery within 6 km, timelines and charges.",
};

const faqs: { q: string; a: string }[] = [
  {
    q: "Which areas do you deliver to?",
    a: "For now we deliver only within Hyderabad. We're working on reaching more cities soon, so do check back.",
  },
  {
    q: "Is delivery free?",
    a: "Delivery is free for locations within a 6 km radius. Beyond that, a charge applies based on the delivery partner's rate for the distance.",
  },
  {
    q: "How quickly will my order arrive?",
    a: "Within Hyderabad we aim to get your order to you within an hour of confirming it. Timings can vary a little with traffic and weather.",
  },
  {
    q: "How is payment handled?",
    a: "All orders are Cash on Delivery. You pay when the order reaches your doorstep.",
  },
  {
    q: "Will I be told when my order is on the way?",
    a: "Yes. We call to confirm right after you place the order, and you can follow the progress any time on our Track Order page.",
  },
];

export default function ShippingPage() {
  return (
    <div>
      <section className="bg-maroon text-cream">
        <div className="container-px py-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            Fast &amp; local
          </p>
          <h1 className="font-serif text-4xl font-bold">Shipping Policy</h1>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Quick, local delivery across Hyderabad — here&apos;s everything you
            need to know.
          </p>
        </div>
      </section>

      <section className="container-px py-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-4 sm:grid-cols-3">
            <Highlight title="Hyderabad only" sub="Serving the city for now" />
            <Highlight title="Free within 6 km" sub="Charges apply beyond" />
            <Highlight title="~1 hour delivery" sub="Within Hyderabad" />
          </div>

          <div className="mt-8 rounded-xl border border-maroon/15 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-maroon">
              How delivery works
            </h2>
            <p className="mt-3 text-sm text-ink/75">
              We currently deliver within Hyderabad only. Orders within a 6 km
              radius ship free of charge. For addresses further out, a delivery
              charge applies as per the delivery partner&apos;s rate for the
              distance covered. Every order is Cash on Delivery, and we call to
              confirm the details right after you place it.
            </p>
          </div>

          <h2 className="mt-10 font-serif text-2xl font-bold text-maroon">
            Common questions
          </h2>
          <div className="mx-0 mt-2 h-0.5 w-16 bg-gold" />
          <div className="mt-6 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border border-maroon/15 bg-white p-4 shadow-card"
              >
                <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                  <span className="flex items-center justify-between">
                    {f.q}
                    <span className="text-maroon transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-xl bg-cream-dark p-6 text-center">
            <p className="text-sm text-ink/70">Have a delivery question?</p>
            <Link href="/contact" className="btn-primary mt-3">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Highlight({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-xl border border-maroon/15 bg-white p-5 text-center shadow-card">
      <p className="font-serif text-lg font-bold text-maroon">{title}</p>
      <p className="mt-1 text-xs text-ink/60">{sub}</p>
    </div>
  );
}
