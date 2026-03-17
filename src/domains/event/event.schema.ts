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
/*                            Event Base Schema                               */
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
  performerIds: z.array(z.string().trim()).optional().default([]),

  // "To be announced" flags – kept in DB as booleans
  performerToBeAnnounced: z.boolean().default(false),
  venueToBeAnnounced: z.boolean().default(false),
  cityToBeAnnounced: z.boolean().default(false),
  scheduleToBeAnnounced: z.boolean().default(false),

  city: z.string().trim().optional(),
  status: EventStatusEnum.default("DRAFT"),

  // Ticket types are created after the event (relation records),
  // so the event can be created without them.
  ticketTypes: z.array(z.string()).optional(),

  startAt: z.date().optional(),
  endAt: z.date().optional(),

  venueId: z.string().trim().optional(),

  // UI-only helper; not stored in DB but part of form type
  ticketTypesToBeAnnounced: z.boolean().default(false),
});

/* -------------------------------------------------------------------------- */
/*                            Event Schema                                    */
/* -------------------------------------------------------------------------- */

export const EventSchema = EventBaseSchema //
  // Performers must exist unless marked TBA
  .refine(
    (data) =>
      data.performerToBeAnnounced || (data.performerIds?.length ?? 0) > 0,
    {
      path: ["performerIds"],
      message: "Select at least one performer or mark as 'to be announced'",
    }
  )
  // City must exist unless marked TBA
  .refine(
    (data) =>
      data.cityToBeAnnounced || Boolean(data.city && data.city.trim().length),
    {
      path: ["city"],
      message: "City is required or mark as 'to be announced'",
    }
  )
  // Venue must exist unless marked TBA
  .refine(
    (data) =>
      data.venueToBeAnnounced ||
      Boolean(data.venueId && data.venueId.trim().length),
    {
      path: ["venueId"],
      message: "Venue is required or mark as 'to be announced'",
    }
  )
  // Date/time rules only when schedule is not TBA
  .refine(
    (data) =>
      data.scheduleToBeAnnounced ||
      (data.startAt instanceof Date &&
        data.endAt instanceof Date &&
        !Number.isNaN(data.startAt.getTime()) &&
        !Number.isNaN(data.endAt.getTime())),
    {
      path: ["startAt"],
      message: "Start and end date are required or mark as 'to be announced'",
    }
  )
  .refine(
    (data) =>
      data.scheduleToBeAnnounced ||
      (data.startAt instanceof Date && data.startAt >= new Date()),
    {
      path: ["startAt"],
      message: "Start date cannot be in the past",
    }
  )
  .refine(
    (data) =>
      data.scheduleToBeAnnounced ||
      (data.endAt instanceof Date && data.endAt >= new Date()),
    {
      path: ["endAt"],
      message: "End date cannot be in the past",
    }
  )
  .refine(
    (data) =>
      data.scheduleToBeAnnounced ||
      (data.startAt instanceof Date &&
        data.endAt instanceof Date &&
        data.endAt > data.startAt),
    {
      path: ["endAt"],
      message: "End date must be after start date",
    }
  );

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
