"use server";

import { z } from "zod";

import {
  createEvent,
  deleteEvent,
  deleteEvents,
  findEvent,
  findEvents,
  updateEventById,
} from "./event.dal";
import { EventInput, EventSchema } from "./event.schema";
import { GetEventParams } from "./event.types";

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
    console.error(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update Event Action                            */
/* -------------------------------------------------------------------------- */

export const updateEventAction = async (id: string, input: EventInput) => {
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

    const event = await updateEventById(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Event updated successfully",
      data: event,
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

/* -------------------------------------------------------------------------- */
/*                            Delete Event Action                            */
/* -------------------------------------------------------------------------- */

export const deleteEventAction = async (id: string) => {
  try {
    const event = await deleteEvent(id);

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event deleted successfully",
      data: event,
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

/* -------------------------------------------------------------------------- */
/*                         Delete Events Action                          */
/* -------------------------------------------------------------------------- */

export const deleteEventsAction = async (ids: string[]) => {
  try {
    const events = await deleteEvents(ids);

    if (!events) {
      return {
        success: false,
        status: 404,
        message: "Events not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Events deleted successfully",
      data: events,
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

/* -------------------------------------------------------------------------- */
/*                     Get Event By Both Id or Slug                       */
/* -------------------------------------------------------------------------- */

export const getEventAction = async (params: GetEventParams) => {
  try {
    const event = await findEvent(params);

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event fetched successfully",
      data: event,
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

/* -------------------------------------------------------------------------- */
/*                            List All Events                                 */
/* -------------------------------------------------------------------------- */

export const listEventsAction = async () => {
  try {
    const events = await findEvents();

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events,
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
