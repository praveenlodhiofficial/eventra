"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";

import { VenueInput, VenueSchema } from "./venue.schema";

/* -------------------------------------------------------------------------- */
/*                            Add Venue Action                             */
/* -------------------------------------------------------------------------- */

export const AddVenueAction = async (input: VenueInput) => {
  try {
    const parsed = VenueSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid venue data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const venue = await prisma.venue.create({
      data: {
        name: parsed.data.name,
        address: parsed.data.address,
        city: parsed.data.city,
        state: parsed.data.state,
        country: parsed.data.country,
        pincode: parsed.data.pincode,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Venue created successfully",
      data: venue,
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
/*                            Get All Venues Action                         */
/* -------------------------------------------------------------------------- */

export const GetAllVenuesAction = async () => {
  try {
    const venues = await prisma.venue.findMany();
    return {
      success: true,
      status: 200,
      message: "Venues fetched successfully",
      data: venues,
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
