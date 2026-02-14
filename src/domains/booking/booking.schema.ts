import { z } from "zod";

export const CreateBookingSchema = z.object({
  eventId: z.string().min(1),
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().min(1),
        quantity: z.number().min(1),
      })
    )
    .min(1),
});

export type CreateBookingInput = z.input<typeof CreateBookingSchema>;
