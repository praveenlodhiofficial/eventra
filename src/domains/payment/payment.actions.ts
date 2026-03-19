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

  // Calculate grand total (order amount + booking fee with GST)
  // Booking fee is 11.8% GST on the order amount
  const orderAmount = Number(booking.totalAmount);
  const bookingFee = orderAmount * 0.118; // 11.8% GST
  const grandTotal = orderAmount + bookingFee;

  const appName = "Eventra";
  const appId = config.razorpay.key_id ?? "unknown";
  const isTestMode = appId.startsWith("rzp_test");

  const order = await razorpay.orders.create({
    amount: Math.round(grandTotal * 100), // Convert to paise (Razorpay expects amount in smallest currency unit)
    currency: "INR",
    receipt: booking.id,
    notes: {
      app_name: appName,
      app_id: appId,
      environment: isTestMode ? "test" : "live",
      booking_id: booking.id,
      event_id: booking.eventId,
      user_id: booking.userId,
      payment_for: "event_tickets",
    },
  });

  // save attempt
  await createPayment({
    bookingId,
    amount: grandTotal, // Store grand total, not just order amount
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
