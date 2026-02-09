"use server";

import { z } from "zod";

import {
  createPerformer,
  deletePerformer,
  deletePerformers,
  findAllPerformers,
  findPerformer,
  searchPerformersByName,
  updatePerformerById,
} from "@/domains/performer/performer.dal";

import { PerformerInput, PerformerSchema } from "./performer.schema";
import { GetPerformerParams } from "./performer.types";

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
/*                            Delete Performer Action                            */
/* -------------------------------------------------------------------------- */

export const deletePerformerAction = async (id: string) => {
  try {
    const performer = await deletePerformer(id);

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
      message: "Performer deleted successfully",
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
/*                         Delete Performers Action                          */
/* -------------------------------------------------------------------------- */

export const deletePerformersAction = async (ids: string[]) => {
  try {
    const performers = await deletePerformers(ids);

    if (!performers) {
      return {
        success: false,
        status: 404,
        message: "Performers not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Performers deleted successfully",
      data: performers,
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
/*                     Get Performer By Both Id or Slug                       */
/* -------------------------------------------------------------------------- */

export const getPerformerAction = async (params: GetPerformerParams) => {
  try {
    const performer = await findPerformer(params);

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
/*                              List Performers Action                         */
/* -------------------------------------------------------------------------- */

export const listPerformersAction = async () => {
  try {
    const performers = await findAllPerformers();

    return {
      success: true,
      status: 200,
      message: "Performers listed successfully",
      data: performers.map((performer) => ({
        id: performer.id,
        name: performer.name,
        image: performer.image,
        slug: performer.slug,
        role: performer.role,
      })),
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
    return await searchPerformersByName(query.trim(), 10);
  } catch (error) {
    console.error(error);
    return [];
  }
};
