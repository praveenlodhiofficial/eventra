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
/*                 Approved Event Categories Enum Constants                   */
/* -------------------------------------------------------------------------- */

export const ApprovedEventCategories = [
  "MUSIC",
  "COMEDY",
  "SPORTS",
  "THEATRE",
  "CONFERENCE",
  "FITNESS",
  "EXHIBITION",
  "FEST",
  "SOCIAL",
] as const;

export const EventCategoryEnum = z.enum(ApprovedEventCategories);
export type EventCategoryEnum = z.infer<typeof EventCategoryEnum>;

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
  imageUrls: z.array(z.string()).optional(),
  category: z.array(EventCategoryEnum).min(1, "Select at least one category"),
  city: z.string().min(3, "City is required").trim(),
  performerIds: z.array(z.string().trim()),
  venueId: z.string().min(1, "Venue is required").trim(),
  startDate: z.date(),
  endDate: z.date(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
});

export type EventInput = z.input<typeof EventSchema>;
export type Event = z.output<typeof EventSchema>;

/* -------------------------------------------------------------------------- */
/*                            Venue Summary Schema                            */
/* -------------------------------------------------------------------------- */

export const EventSummarySchema = EventSchema.pick({
  name: true,
  venueId: true,
  city: true,
  startDate: true,
  endDate: true,
  price: true,
}).extend({
  id: z.string(),
  slug: z.string(),
});

export type EventSummaryInput = z.input<typeof EventSummarySchema>;
export type EventSummary = z.output<typeof EventSummarySchema>;
