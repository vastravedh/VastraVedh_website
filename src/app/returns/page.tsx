import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Exchange — VastraVedh",
  description:
    "Read how returns and exchanges work at VastraVedh, including eligibility, timelines and how to raise a request.",
};

const faqs: { q: string; a: string }[] = [
  {
    q: "How long do I have to raise a return or exchange?",
    a: "You can request a return or an exchange within 7 days of receiving your order. After this window we're unable to accept the item back.",
  },
  {
    q: "What condition does the product need to be in?",
    a: "The item should be unused and unworn, with all original tags in place and the packaging intact. Pieces that have been washed, altered or damaged after delivery can't be taken back.",
  },
  {
    q: "How do I start a return or exchange?",
    a: "Reach out to us on WhatsApp or call the number on our Contact page with your order ID and the reason. Our team will guide you through the next steps.",
  },
  {
    q: "When will I get my refund?",
    a: "Since orders are Cash on Delivery, approved refunds are handled directly by our team. We'll confirm the method and process it once the returned item reaches us and passes a quick check.",
  },
  {
    q: "Can I exchange for a different size or colour?",
    a: "Yes, subject to availability. If your preferred size or colour is in stock, we'll arrange the swap; if not, we'll help you pick an alternative or arrange a refund.",
  },
];

export default function ReturnsPage() {
  return (
    <div>
      <section className="bg-maroon text-cream">
        <div className="container-px py-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            Hassle-free
          </p>
          <h1 className="font-serif text-4xl font-bold">Returns &amp; Exchange</h1>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            We want you to love what you receive. If something isn&apos;t quite
            right, here&apos;s how we can help.
          </p>
        </div>
      </section>

      <section className="container-px py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-maroon/15 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-maroon">
              The short version
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/75">
              <li className="flex gap-3">
                <span className="text-maroon">•</span> Requests are accepted
                within 7 days of delivery.
              </li>
              <li className="flex gap-3">
                <span className="text-maroon">•</span> Items must be unused, with
                tags and original packaging intact.
              </li>
              <li className="flex gap-3">
                <span className="text-maroon">•</span> Exchanges depend on stock
                availability for your chosen size or colour.
              </li>
              <li className="flex gap-3">
                <span className="text-maroon">•</span> To start, contact us with
                your order ID.
              </li>
            </ul>
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
            <p className="text-sm text-ink/70">
              Still have a question about a return?
            </p>
            <Link href="/contact" className="btn-primary mt-3">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
