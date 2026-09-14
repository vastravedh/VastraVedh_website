import { Suspense } from "react";
import Confirmation from "./Confirmation";

export const metadata = { title: "Order Confirmed — VastraVedh" };

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="container-px py-24 text-center text-ink/50">
          Loading…
        </div>
      }
    >
      <Confirmation />
    </Suspense>
  );
}
