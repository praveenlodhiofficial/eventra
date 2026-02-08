import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                            Event Image Schema                              */
/* -------------------------------------------------------------------------- */

export const EventImageSchema = z.object({
  url: z.string().min(3).trim().optional(),
  eventId: z.string().min(3).trim(),
});

export type EventImageInput = z.input<typeof EventImageSchema>;
export type EventImage = z.output<typeof EventImageSchema>;

/* -------------------------------------------------------------------------- */
/*                            Event Schema                                    */
/* -------------------------------------------------------------------------- */

export const EventSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Event name must be at least 3 characters")
    .max(100, "Event name cannot exceed 100 characters")
    .trim(),

  description: z.string().min(3, "Description is too short").trim(),
  coverImage: z.string().min(1, "Cover image is required"),
  images: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).min(1, "Select at least one category"),
  city: z.string().min(1, "City is required").trim(),
  performerIds: z
    .array(z.string().trim())
    .min(1, "Select at least one performer"),
  venueId: z.string().min(1, "Venue is required").trim(),
  startAt: z.date(),
  endAt: z.date(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export type EventInput = z.input<typeof EventSchema>;
export type Event = z.output<typeof EventSchema>;

/* -------------------------------------------------------------------------- */
/*                            Event Summary Schema                            */
/* -------------------------------------------------------------------------- */

export const EventSummarySchema = EventSchema.pick({
  name: true,
  venueId: true,
  city: true,
  startAt: true,
  endAt: true,
  price: true,
}).extend({
  id: z.string(),
  slug: z.string(),
});

export type EventSummaryInput = z.input<typeof EventSummarySchema>;
export type EventSummary = z.output<typeof EventSummarySchema>;
