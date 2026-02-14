import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Booking Item Schema                             */
/* -------------------------------------------------------------------------- */

export const BookingItemSchema = z.object({
  id: z.string().optional(),
  bookingId: z.string().min(1, "Booking is required"),
  ticketTypeId: z.string().min(1, "Ticket type is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type BookingItemInput = z.input<typeof BookingItemSchema>;
export type BookingItem = z.output<typeof BookingItemSchema>;
