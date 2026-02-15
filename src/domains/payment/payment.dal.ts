import prisma from "@/lib/prisma";

import { PaymentInput } from "./payment.schema";

export const createPayment = async (data: PaymentInput) => {
  return prisma.payment.create({
    data: {
      bookingId: data.bookingId,
      provider: data.provider,

      razorpayOrderId: data.razorpay?.razorpay_order_id,
      razorpayPaymentId: data.razorpay?.razorpay_payment_id,
      razorpaySignature: data.razorpay?.razorpay_signature,

      amount: data.amount,
      currency: data.currency,
      status: data.status,
    },
  });
};
