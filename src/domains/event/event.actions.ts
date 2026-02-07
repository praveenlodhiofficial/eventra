"use server";

import { z } from "zod";

import {
  createEvent,
  deleteEventById,
  findAllEvents,
  findEventById,
  findEventBySlug,
  findEvents,
  findUpcomingEvents,
  updateEventById,
} from "./event.dal";
import { EventCategoryEnum, EventInput, EventSchema } from "./event.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Event Action                            */
/* -------------------------------------------------------------------------- */

export const createEventAction = async (input: EventInput) => {
  try {
    const parsed = EventSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const event = await createEvent(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Event created successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Get Event By Id Action                            */
/* -------------------------------------------------------------------------- */

export const getEventByIdAction = async (id: string) => {
  try {
    const event = await findEventById(id);

    if (!event) {
      return { success: false, status: 404, message: "Event not found" };
    }

    return {
      success: true,
      status: 200,
      message: "Event fetched successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update Event Action                            */
/* -------------------------------------------------------------------------- */

export const updateEventAction = async (
  id: string,
  input: Partial<EventInput>
) => {
  try {
    const parsed = EventSchema.partial().safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const exists = await findEventById(id);
    if (!exists) {
      return { success: false, status: 404, message: "Event not found" };
    }

    const event = await updateEventById(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Event updated successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                       Get Events By Category Action                        */
/* -------------------------------------------------------------------------- */

export const getEventsByCategoryAction = async (category: string) => {
  const parsed = EventCategoryEnum.safeParse(category);

  if (!parsed.success) {
    return { success: false, status: 400, message: "Invalid category" };
  }

  try {
    const events = await findEvents({ category: parsed.data });

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.log(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                            List All Events                                 */
/* -------------------------------------------------------------------------- */

export const listEventsAction = async () => {
  try {
    const events = await findAllEvents();

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events.map((event) => ({
        ...event,
        venue: event.venue.name,
      })),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};
