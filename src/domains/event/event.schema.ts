import { z } from "zod";

import { EVENT_STATUS } from "./event.constants";

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
/*                           Event Status Enum                                */
/* -------------------------------------------------------------------------- */

export const EventStatusEnum = z.enum(EVENT_STATUS);

/* -------------------------------------------------------------------------- */
/*                            Event Base Schema                                */
/* -------------------------------------------------------------------------- */

export const EventBaseSchema = z.object({
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
  performerIds: z
    .array(z.string().trim())
    .min(1, "Select at least one performer"),

  city: z.string().min(1, "City is required").trim(),
  status: EventStatusEnum.default("DRAFT"),

  ticketTypes: z.array(z.string()).min(1, "Select at least one ticket type"),

  startAt: z.date().min(new Date(), "Start date cannot be in the past"),
  endAt: z.date().min(new Date(), "End date cannot be in the past"),

  venueId: z.string().min(1, "Venue is required").trim(),
});

/* -------------------------------------------------------------------------- */
/*                            Event Schema                                    */
/* -------------------------------------------------------------------------- */

export const EventSchema = EventBaseSchema.refine(
  (data) => data.startAt >= new Date(),
  {
    path: ["startAt"],
    message: "Start date cannot be in the past",
  }
)
  .refine((data) => data.endAt >= new Date(), {
    path: ["endAt"],
    message: "End date cannot be in the past",
  })
  .refine((data) => data.endAt > data.startAt, {
    path: ["endAt"],
    message: "End date must be after start date",
  });

export type EventInput = z.input<typeof EventSchema>;
export type Event = z.output<typeof EventSchema>;

/* -------------------------------------------------------------------------- */
/*                            Event Summary Schema                            */
/* -------------------------------------------------------------------------- */

export const EventSummarySchema = EventBaseSchema.pick({
  name: true,
  city: true,
  venueId: true,
  startAt: true,
  endAt: true,
  status: true,
}).extend({
  id: z.string(),
  slug: z.string(),
});

export type EventSummaryInput = z.input<typeof EventSummarySchema>;
export type EventSummary = z.output<typeof EventSummarySchema>;
