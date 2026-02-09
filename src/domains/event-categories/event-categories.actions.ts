"use server";

import { z } from "zod";

import {
  createEventCategory,
  deleteEventCategories,
  deleteEventCategory,
  findEventCategories,
  updateEventCategory,
} from "./event-categories.dal";
import {
  EventCategoryInput,
  EventCategorySchema,
} from "./event-categories.schema";

/* -------------------------------------------------------------------------- */
/*                       Create Event Category Action                         */
/* -------------------------------------------------------------------------- */

export const createEventCategoryAction = async (input: EventCategoryInput) => {
  try {
    const parsed = EventCategorySchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event category data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const eventCategory = await createEventCategory(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Event category created successfully",
      data: eventCategory,
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                        Update Event Category Action                        */
/* -------------------------------------------------------------------------- */

export const updateEventCategoryAction = async (
  id: string,
  input: EventCategoryInput
) => {
  try {
    const parsed = EventCategorySchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event category data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const eventCategory = await updateEventCategory(id, parsed.data);

    return {
      success: true,
      status: 201,
      message: "Event category updated successfully",
      data: eventCategory,
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};

/* -------------------------------------------------------------------------- */
/*                      Delete Event Category Action                          */
/* -------------------------------------------------------------------------- */
export const deleteEventCategoryAction = async (id: string) => {
  try {
    const eventCategory = await deleteEventCategory(id);

    if (!eventCategory) {
      return {
        success: false,
        status: 404,
        message: "Event category not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event category deleted successfully",
      data: eventCategory,
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
/*                      Delete Event Categories Action                        */
/* -------------------------------------------------------------------------- */

export const deleteEventCategoriesAction = async (ids: string[]) => {
  try {
    const eventCategories = await deleteEventCategories(ids);

    if (!eventCategories) {
      return {
        success: false,
        status: 404,
        message: "Event categories not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event categories deleted successfully",
      data: eventCategories,
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
/*                      List All Event Categories Action                      */
/* -------------------------------------------------------------------------- */

export const listEventCategoriesAction = async () => {
  try {
    const eventCategories = await findEventCategories();

    return {
      success: true,
      status: 200,
      message: "Event categories fetched successfully",
      data: eventCategories,
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};
