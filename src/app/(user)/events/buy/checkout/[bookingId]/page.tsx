import BillingFormDetails from "@/components/BillingFormDetails";
import OrderSummary from "@/components/OrderSummary";
import StepIndicator from "@/components/StepIndicator";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = await params;

  return (
    <div className="w-full space-y-3">
      {/* ================================ STEP INDICATOR ================================ */}
      {/* <StepIndicator step={1} /> */}

      {/* ================================ ORDER SUMMARY ================================ */}
      <OrderSummary bookingId={bookingId} />

      {/* ================================ BILLING FORM DETAILS ================================ */}
      <BillingFormDetails bookingId={bookingId} />
    </div>
  );
}
