import { z } from "zod";

export const feedBackSchema = z.object({
   id: z.string({ message: "Invalid id" }),
   eventId: z.string({ message: "Invalid event id" }),
   userId: z.string({ message: "Invalid user id" }),
   feedback: z.string({ message: "Invalid feedback" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
});

export const feedBackCreateSchema = feedBackSchema.omit({
   id: true,
   createdAt: true,
   updatedAt: true,
});

export type FeedBackSchema = z.infer<typeof feedBackSchema>;
export type FeedBackCreateSchema = z.infer<typeof feedBackCreateSchema>;
