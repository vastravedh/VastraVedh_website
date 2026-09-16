import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — VastraVedh",
  description:
    "Get in touch with VastraVedh. Questions about orders, sizing, shipping or returns? Reach us by phone, email or the contact form.",
};

const PHONE = "9063905840";
const EMAIL = "vastravedh3105@gmail.com";
const INSTAGRAM_URL = "https://instagram.com/vastravedh3105";

export default async function ContactPage() {
  // Generate the Instagram QR at request time as an inline SVG data URL so it
  // always renders without shipping a separate image file.
  const instagramQr = await QRCode.toString(INSTAGRAM_URL, {
    type: "svg",
    margin: 1,
    color: { dark: "#7B0F2B", light: "#FFFFFF" },
  });
  const instagramQrDataUrl = `data:image/svg+xml;base64,${Buffer.from(
    instagramQr
  ).toString("base64")}`;

  return (
    <div>
      {/* Hero */}
      <section className="bg-maroon text-cream">
        <div className="container-px py-14 text-center md:py-20">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            We&apos;d love to hear from you
          </p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/80">
            The Grace of Her Traditions, The Glow of Her Confidence. Have a
            question about an order, sizing or a product? Our team is here to help.
          </p>
        </div>
      </section>

      <section className="container-px py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Contact details */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-maroon">
              Reach us directly
            </h2>
            <div className="mx-0 mt-3 h-0.5 w-16 bg-gold" />

            <ul className="mt-6 space-y-5 text-sm">
              <ContactItem
                label="Call / WhatsApp"
                value={`+91 ${PHONE}`}
                href={`tel:+91${PHONE}`}
                icon="📞"
              />
              <ContactItem
                label="Email"
                value={EMAIL}
                href={`mailto:${EMAIL}`}
                icon="✉️"
              />
              <ContactItem
                label="Website"
                value="vastravedh.com"
                href="https://vastravedh.com"
                icon="🌐"
              />
              <ContactItem
                label="Facebook"
                value="Vastravedh"
                href="https://facebook.com/Vastravedh"
                icon="📘"
              />
              <ContactItem
                label="Instagram"
                value="@vastravedh3105"
                href="https://instagram.com/vastravedh3105"
                icon="📷"
              />
            </ul>

            {/* Instagram QR */}
            <div className="mt-8 flex flex-col items-center rounded-xl border border-maroon/15 bg-white p-5 text-center shadow-card sm:flex-row sm:text-left">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={instagramQrDataUrl}
                  alt="Scan to follow VastraVedh on Instagram (@vastravedh3105)"
                  width={140}
                  height={140}
                  className="h-32 w-32 rounded-lg object-contain"
                />
              </a>
              <div className="mt-4 sm:ml-5 sm:mt-0">
                <h3 className="font-serif text-lg font-bold text-maroon">
                  Follow us on Instagram
                </h3>
                <p className="mt-1 text-sm text-ink/70">
                  Scan the code to see our latest collections and offers
                  <span className="mt-1 block font-medium text-maroon">
                    @vastravedh3105
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-cream-dark p-5">
              <h3 className="font-serif text-lg font-bold text-maroon">
                Support hours
              </h3>
              <p className="mt-1 text-sm text-ink/70">
                Monday – Saturday, 10:00 AM – 7:00 PM IST
              </p>
              <p className="mt-3 text-sm text-ink/70">
                For order-related queries, please keep your order ID handy so we
                can assist you faster.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl font-bold text-maroon">
              Send us a message
            </h2>
            <div className="mx-0 mb-6 mt-3 h-0.5 w-16 bg-gold" />
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-maroon/10 bg-cream-dark">
        <div className="container-px flex flex-col items-center justify-between gap-4 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-serif text-xl font-bold text-maroon">
              Ready to shop the collection?
            </h3>
            <p className="text-sm text-ink/60">
              Explore our curated women&apos;s ethnic wear.
            </p>
          </div>
          <Link href="/" className="btn-gold">
            Browse Collection
          </Link>
        </div>
      </section>
    </div>
  );
}

function ContactItem({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href: string;
  icon: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-maroon/5 text-base"
      >
        {icon}
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
        <a
          href={href}
          className="font-medium text-ink transition-colors hover:text-maroon"
        >
          {value}
        </a>
      </div>
    </li>
  );
}
