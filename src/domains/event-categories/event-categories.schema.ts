import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Event Category Schema                              */
/* -------------------------------------------------------------------------- */

export const EventCategorySchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Event category name must be at least 3 characters")
    .max(100, "Event category name cannot exceed 100 characters")
    .trim(),
});

export type EventCategoryInput = z.input<typeof EventCategorySchema>;
export type EventCategory = z.output<typeof EventCategorySchema>;
