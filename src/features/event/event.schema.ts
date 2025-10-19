import { EventType, TicketType } from "@/generated/prisma";
import { z } from "zod";

export const eventSchema = z.object({
   id: z.string({ message: "Invalid id" }),
   name: z.string({ message: "Invalid name" }),
   description: z.string({ message: "Invalid description" }),
   startDate: z.date({ message: "Invalid start date" }),
   endDate: z.date({ message: "Invalid end date" }),
   location: z.string({ message: "Invalid location" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
   EventType: z.enum(EventType, { message: "Invalid event type" }),
   TicketType: z.array(z.enum(TicketType, { message: "Invalid ticket type" })),
});

export const eventCreateSchema = eventSchema.omit({ id: true, createdAt: true, updatedAt: true });

export type EventSchema = z.infer<typeof eventSchema>;
export type EventCreateSchema = z.infer<typeof eventCreateSchema>;
