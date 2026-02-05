"use server";

import { z } from "zod";

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
/*                            Get All Performers Action                       */
/* -------------------------------------------------------------------------- */

export const GetAllPerformersAction = async () => {
  try {
    const performers = await prisma.performer.findMany();
    return {
      success: true,
      status: 200,
      message: "Performers fetched successfully",
      performers: performers.map((performer) => ({
        name: performer.name,
        id: performer.id,
        image: performer.image,
        bio: performer.bio,
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

export type PerformerSearchResult = {
  id: string;
  name: string;
  image: string;
};

export const SearchPerformersAction = async (
  query: string
): Promise<PerformerSearchResult[]> => {
  if (!query || query.trim().length < 2) return [];

  const q = query.trim();

  const performers = await prisma.performer.findMany({
    where: {
      name: {
        contains: q,
        mode: "insensitive",
      },
    },
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
    },
  });

  return performers;
};
