import Script from "next/script";

import BillingFormDetails from "@/components/BillingFormDetails";
import OrderSummary from "@/components/OrderSummary";
import RazorpayPayment from "@/components/RazorpayPayment";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = await params;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="w-full space-y-3">
        {/* ================================ STEP INDICATOR ================================ */}
        {/* <StepIndicator step={1} /> */}

        {/* ================================ ORDER SUMMARY ================================ */}
        <OrderSummary bookingId={bookingId} />

        {/* ================================ BILLING FORM DETAILS ================================ */}
        <BillingFormDetails bookingId={bookingId} />

        {/* ================================ RAZORPAY PAYMENT ================================ */}
        <RazorpayPayment bookingId={bookingId} />
      </div>
    </>
  );
}
