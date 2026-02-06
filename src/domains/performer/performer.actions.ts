"use server";

import { z } from "zod";

import {
  getAllPerformers,
  getPerformerById,
  searchPerformersByName,
} from "@/data-access-layer/performer.dal";
import prisma from "@/lib/prisma";

import { PerformerInput, PerformerSchema } from "./performer.schema";

/* -------------------------------------------------------------------------- */
/*                            Add Performer Action                            */
/* -------------------------------------------------------------------------- */

export const AddPerformerAction = async (input: PerformerInput) => {
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

    const performer = await prisma.performer.create({
      data: {
        name: parsed.data.name,
        image: parsed.data.image,
        bio: parsed.data.bio,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Performer created successfully",
      data: performer,
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
/*                            Update Performer Action                            */
/* -------------------------------------------------------------------------- */

export const UpdatePerformerAction = async (
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

    const performer = await prisma.performer.update({
      where: {
        id,
      },
      data: {
        name: parsed.data.name,
        image: parsed.data.image,
        bio: parsed.data.bio,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Performer updated successfully",
      data: performer,
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
/*                              Get All Performers Action                         */
/* -------------------------------------------------------------------------- */

export const getPerformersAction = async () => {
  try {
    const performers = await getAllPerformers();

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
/*                             Get Performer By Id Action                         */
/* -------------------------------------------------------------------------- */

export const getPerformerAction = async (id: string) => {
  try {
    const performer = await getPerformerById(id);

    return {
      success: true,
      status: 200,
      message: "Performer fetched successfully",
      data: performer,
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
