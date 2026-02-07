"use server";

import prisma from "@/lib/prisma";

import { Venue, VenueSummary } from "./venue.schema";

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
      city: true,
      state: true,
      country: true,
      pincode: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           Search Venues By Name or City                        */
/* -------------------------------------------------------------------------- */
export const searchVenuesByNameOrCity = async (
  query: string,
  limit = 10
): Promise<VenueSummary[]> => {
  return prisma.venue.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      city: true,
    },
  });
};
