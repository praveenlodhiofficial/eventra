"use server";

import prisma from "@/lib/prisma";

import { Venue } from "./venue.schema";

/* -------------------------------------------------------------------------- */
/*                               Create Venue                                 */
/* -------------------------------------------------------------------------- */

export const createVenue = async (data: Venue) => {
  return prisma.venue.create({ data });
};

/* -------------------------------------------------------------------------- */
/*                               Update Venue                                 */
/* -------------------------------------------------------------------------- */

export const updateVenueById = async (id: string, data: Venue) => {
  return prisma.venue.update({
    where: { id },
    data,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Find Venue By Id                                */
/* -------------------------------------------------------------------------- */

export const findVenueById = async (id: string) => {
  return prisma.venue.findUnique({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                            Find All Venues                                 */
/* -------------------------------------------------------------------------- */

export const findAllVenues = async () => {
  return prisma.venue.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      address: true,
      city: true,
      state: true,
      country: true,
      pincode: true,
    },
  });
};
