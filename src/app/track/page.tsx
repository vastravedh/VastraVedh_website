import type { Metadata } from "next";
import TrackOrder from "./TrackOrder";

export const metadata: Metadata = {
  title: "Track Order — VastraVedh",
  description:
    "Track your VastraVedh order. Enter your order ID and phone number to see delivery progress.",
};

export default function TrackOrderPage() {
  return (
    <div>
      <section className="bg-maroon text-cream">
        <div className="container-px py-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gold">
            Order Tracking
          </p>
          <h1 className="font-serif text-4xl font-bold">Track Your Order</h1>
          <p className="mx-auto mt-3 max-w-md text-cream/80">
            Enter your order ID and the phone number you used at checkout to see
            where your order is.
          </p>
        </div>
      </section>

      <section className="container-px py-12">
        <TrackOrder />
      </section>
    </div>
  );
}
