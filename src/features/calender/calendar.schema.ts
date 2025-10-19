import { z } from "zod";

export const calendarSchema = z.object({
   id: z.string({ message: "Invalid id" }),
   eventId: z.string({ message: "Invalid event id" }),
   userId: z.string({ message: "Invalid user id" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
});

export const calendarCreateSchema = calendarSchema.omit({
   id: true,
   createdAt: true,
   updatedAt: true,
});

export type CalendarSchema = z.infer<typeof calendarSchema>;
export type CalendarCreateSchema = z.infer<typeof calendarCreateSchema>;
