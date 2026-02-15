import { z } from "zod";

import { NATIONALITY } from "./billing.constants";

/* -------------------------------------------------------------------------- */
/*                            Nationality Enum                                */
/* -------------------------------------------------------------------------- */

export const NationalityEnum = z.enum(NATIONALITY);

/* -------------------------------------------------------------------------- */
/*                            Billing Details Schema                          */
/* -------------------------------------------------------------------------- */

export const BillingDetailsSchema = z
  .object({
    bookingId: z.string().min(1, "Booking is required"),
    name: z.string().min(1, "Name is required").trim(),
    phone: z.string().min(1, "Phone is required").trim(),
    email: z.email().min(1, "Valid email is required").trim(),
    nationality: NationalityEnum.default("INDIAN"),
    state: z.string().optional(),
    acceptedTerms: z.literal(false, {
      message: "You must accept terms and conditions",
    }),
  })
  .refine((data) => data.nationality === "INTERNATIONAL" || !!data.state, {
    message: "State is required for Indian residents",
    path: ["state"],
  });

export type BillingDetailsInput = z.input<typeof BillingDetailsSchema>;
export type BillingDetails = z.output<typeof BillingDetailsSchema>;
