import { TicketType } from "@/generated/prisma";
import { z } from "zod";

export const ticketSchema = z.object({
   id: z.string({ message: "Invalid id" }),
   eventId: z.string({ message: "Invalid event id" }),
   ticketType: z.nativeEnum(TicketType, { message: "Invalid ticket type" }),
   price: z.number({ message: "Invalid price" }),
   quantity: z.number().int({ message: "Quantity must be an integer" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
});

export const ticketCreateSchema = ticketSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type TicketSchema = z.infer<typeof ticketSchema>;
export type TicketCreateSchema = z.infer<typeof ticketCreateSchema>;
