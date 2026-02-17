"use client";

import { useState } from "react";

import { ActionButton2 } from "@/components/ui/action-button";
import {
  createRazorpayOrderAction,
  verifyPaymentAction,
} from "@/domains/payment/payment.actions";
import { config } from "@/lib/config";
import { RazorpayOptions } from "@/types/razorpay";

export default function RazorpayPayment({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await createRazorpayOrderAction(bookingId);

    if (!res.success) return;

    const order = res.order;

    if (!order) return;

    const options = {
      key: config.razorpay.key_id,
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,

      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        await verifyPaymentAction(response);
        window.location.reload();
      },
    };

    const rzp = new window.Razorpay(options as RazorpayOptions);
    rzp.open();
    setLoading(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl justify-center">
      <ActionButton2
        onClick={handlePay}
        isLoading={loading}
        className="w-full cursor-pointer py-6.5 md:py-7"
      >
        {loading ? "Processing..." : "Pay Now"}
      </ActionButton2>
    </div>
  );
}
