"use server";

import { z } from "zod";

import {
  createPerformer,
  findAllPerformers,
  findPerformerById,
  searchPerformersByName,
  updatePerformerById,
} from "@/domains/performer/performer.dal";

import { PerformerInput, PerformerSchema } from "./performer.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Performer                                */
/* -------------------------------------------------------------------------- */

export const createPerformerAction = async (input: PerformerInput) => {
  try {
    const parsed = PerformerSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid performer data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const performer = await createPerformer(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Performer created successfully",
      data: performer,
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
/*                            Update Performer                                */
/* -------------------------------------------------------------------------- */

export const updatePerformerAction = async (
  id: string,
  input: PerformerInput
) => {
  try {
    const parsed = PerformerSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid performer data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const performer = await updatePerformerById(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Performer updated successfully",
      data: performer,
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
/*                         Get Performer By Id Action                         */
/* -------------------------------------------------------------------------- */

export const getPerformerAction = async (id: string) => {
  try {
    const performer = await findPerformerById(id);

    if (!performer) {
      return {
        success: false,
        status: 404,
        message: "Performer not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Performer fetched successfully",
      data: performer,
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
/*                              Get All Performers Action                         */
/* -------------------------------------------------------------------------- */

export const getPerformersAction = async () => {
  try {
    const performers = await findAllPerformers();

    return {
      success: true,
      status: 200,
      message: "Performers fetched successfully",
      data: performers,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Search Performers Action                        */
/* -------------------------------------------------------------------------- */

export const searchPerformersAction = async (query: string) => {
  if (!query || query.trim().length < 2) return [];

  try {
    return await searchPerformersByName(query.trim());
  } catch (error) {
    console.error(error);
    return [];
  }
};
