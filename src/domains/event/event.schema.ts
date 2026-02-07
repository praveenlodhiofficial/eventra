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
  name: z.string().min(3).max(100).trim(),
  slug: z.string().min(3).max(100).trim(),
  description: z.string().min(3).trim(),

  coverImage: z.string().min(3).trim(),

  imageUrls: z.array(z.string().min(3)).optional(),

  category: z.array(EventCategoryEnum).min(1),
  city: z.string().min(3).trim(),

  performerIds: z.array(z.string().min(1).trim()),

  venueIds: z.array(z.string().min(1).trim()),

  startDate: z.date(),
  endDate: z.date(),

  price: z.number().min(0),
});

export type EventInput = z.input<typeof EventSchema>;
export type Event = z.output<typeof EventSchema>;
