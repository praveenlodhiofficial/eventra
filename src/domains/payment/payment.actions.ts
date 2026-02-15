"use server";

import { z } from "zod";

import { createPayment } from "./payment.dal";
import { PaymentSchema } from "./payment.schema";

export async function createPaymentAction(input: unknown) {
  const parsed = PaymentSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid payment data",
      errors: z.treeifyError(parsed.error),
    };
  }

  try {
    const payment = await createPayment(parsed.data);

    return {
      success: true,
      status: 201,
      data: payment,
    };
  } catch (error) {
    console.error("Create payment error:", error);

    return {
      success: false,
      status: 500,
      message: "Failed to create payment",
    };
  }
}
