import Script from "next/script";

import BillingFormDetails from "@/components/BillingFormDetails";
import OrderSummary from "@/components/OrderSummary";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = await params;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="via-background overflow-hidden bg-linear-to-b from-indigo-500/5 to-cyan-500/5">
        {/* ================================ NAVBAR ================================ */}
        <div className="bg-background/80 sticky top-0 z-40 border-b border-indigo-500/15 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
            <div className="space-y-0.5">
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Secure checkout
              </p>
              <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                Checkout
              </h1>
            </div>
            <p className="text-muted-foreground hidden text-sm md:block">
              Booking ID:{" "}
              <span className="text-foreground font-medium">{bookingId}</span>
            </p>
          </div>
        </div>

        {/* ================================ CHECKOUT SUMMARY ================================ */}
        <div className="mx-3 grid max-w-6xl grid-cols-1 md:mx-5 md:grid-cols-2 md:gap-6 lg:mx-auto lg:gap-10">
          <div className="order-2 md:order-1">
            <BillingFormDetails bookingId={bookingId} />
          </div>
          <div className="order-1 md:order-2">
            <OrderSummary bookingId={bookingId} />
          </div>
        </div>
      </div>
    </>
  );
}
