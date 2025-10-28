import { EventType, TicketType } from "@/generated/prisma";
import { z } from "zod";

// ======================================= EVENT SCHEMA =======================================

export const eventSchema = z.object({
   id: z.string({ message: "Invalid id" }),
   name: z.string({ message: "Invalid name" }),
   description: z.string({ message: "Invalid description" }),
   startDate: z.date({ message: "Invalid start date" }),
   endDate: z.date({ message: "Invalid end date" }),
   coverImageUrl: z.string({ message: "Invalid cover image url" }).optional(),
   imageUrl: z.array(z.string({ message: "Invalid image url" })).default([]),
   location: z.string({ message: "Invalid location" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
   eventType: z.enum(EventType, { message: "Invalid event type" }),
   ticketType: z.enum(TicketType, { message: "Invalid ticket type" }),
});

export type EventSchema = z.infer<typeof eventSchema>;
