"use server";

import prisma from "@/lib/prisma";

export const getAllVenues = async () => {
  try {
    const venues = await prisma.venue.findMany();
    console.log(`venues fetched successfully: ${venues.length}`);
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
