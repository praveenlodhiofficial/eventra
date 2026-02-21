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
      <div className="fixed top-0 left-0 w-full space-y-3 bg-conic-180 from-indigo-600/70 via-indigo-50 to-indigo-600/70">
        {/* ================================ STEP INDICATOR ================================ */}
        {/* <StepIndicator step={1} /> */}

        <div className="no-scrollbar h-screen space-y-10 overflow-y-auto py-30">
          {/* ===================== ORDER SUMMARY ===================== */}
          <OrderSummary bookingId={bookingId} />

          {/* ============== BILLING FORM DETAILS & PAYMENT ============== */}
          <BillingFormDetails bookingId={bookingId} />
        </div>
      </div>
    </>
  );
}
