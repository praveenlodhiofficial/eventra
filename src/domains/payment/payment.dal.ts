import prisma from "@/lib/prisma";

type CreatePaymentProps = {
  bookingId: string;
  amount: number;
  orderId: string;
};

export async function createPayment({
  bookingId,
  amount,
  orderId,
}: CreatePaymentProps) {
  return prisma.payment.create({
    data: {
      bookingId,
      amount,
      currency: "INR",
      razorpayOrderId: orderId,
      status: "PENDING",
      provider: "RAZORPAY",
    },
  });
}
