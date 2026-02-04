"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";

import { PerformerInput, PerformerSchema } from "./performer.schema";

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
