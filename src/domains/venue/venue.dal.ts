"use server";

import prisma from "@/lib/prisma";

export const getVenueById = async (id: string) => {
  return prisma.venue.findUnique({
    where: { id },
  });
};

export const getAllVenues = async () => {
  return prisma.venue.findMany({
    orderBy: {
      name: "asc",
    },
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
