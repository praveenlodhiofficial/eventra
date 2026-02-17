"use server";

import crypto from "crypto";

import { config } from "@/lib/config";
import prisma from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";

import { findBookingById } from "../booking/booking.dal";
import { createPayment } from "./payment.dal";

export async function createRazorpayOrderAction(bookingId: string) {
  const booking = await findBookingById(bookingId);

  if (!booking) {
    return { success: false, message: "Booking not found" };
  }

  const order = await razorpay.orders.create({
    amount: Number(booking.totalAmount) * 100,
    currency: "INR",
    receipt: booking.id,
  });

  // save attempt
  await createPayment({
    bookingId,
    amount: Number(booking.totalAmount),
    orderId: order.id,
  });

  return {
    success: true,
    order,
  };
}

export async function verifyPaymentAction(data: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}) {
  const body = data.razorpay_order_id + "|" + data.razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", config.razorpay.key_secret!)
    .update(body)
    .digest("hex");

  const isValid = expected === data.razorpay_signature;

  if (!isValid) {
    await prisma.payment.update({
      where: { razorpayOrderId: data.razorpay_order_id },
      data: { status: "FAILED" },
    });

    return { success: false };
  }

  // mark payment success
  const payment = await prisma.payment.update({
    where: { razorpayOrderId: data.razorpay_order_id },
    data: {
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature,
      status: "SUCCESS",
    },
  });

  // confirm booking
  await prisma.booking.update({
    where: { id: payment.bookingId },
    data: { status: "CONFIRMED" },
  });

  return { success: true };
}
