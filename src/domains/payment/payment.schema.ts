import { z } from "zod";

import { PAYMENT_PROVIDER, PAYMENT_STATUS } from "./payment.constants";

/* -------------------------------------------------------------------------- */
/*                            Payment Provider Enum                            */
/* -------------------------------------------------------------------------- */

export const PaymentProviderEnum = z.enum(PAYMENT_PROVIDER);

/* -------------------------------------------------------------------------- */
/*                            Payment Status Enum                              */
/* -------------------------------------------------------------------------- */

export const PaymentStatusEnum = z.enum(PAYMENT_STATUS);

/* -------------------------------------------------------------------------- */
/*                            Payment Schema                                  */
/* -------------------------------------------------------------------------- */

export const PaymentSchema = z.object({
  bookingId: z.string().min(1, "Booking is required"),
  provider: PaymentProviderEnum.default("RAZORPAY"),

  razorpay: z
    .object({
      razorpay_order_id: z.string().min(1).optional(),
      razorpay_payment_id: z.string().min(1).optional(),
      razorpay_signature: z.string().min(1).optional(),
    })
    .optional(),

  amount: z.coerce.number().min(1, "Amount is required"),
  currency: z.string().default("INR"),

  status: PaymentStatusEnum.default("PENDING"),
});

export type PaymentInput = z.infer<typeof PaymentSchema>;
export type Payment = z.output<typeof PaymentSchema>;
