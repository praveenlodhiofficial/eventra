import { z } from "zod";

export const TicketTypeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
  eventId: z.cuid(),
});

export type TicketTypeInput = z.infer<typeof TicketTypeSchema>;
export type TicketType = z.output<typeof TicketTypeSchema>;
