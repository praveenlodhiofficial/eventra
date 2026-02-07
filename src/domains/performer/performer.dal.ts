"use server";

import {
  Performer,
  PerformerSummaryOutput,
} from "@/domains/performer/performer.schema";
import prisma from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                            Add Performer                                   */
/* -------------------------------------------------------------------------- */

export const createPerformer = async (data: Performer) => {
  return prisma.performer.create({ data });
};

/* -------------------------------------------------------------------------- */
/*                            Update Performer                                */
/* -------------------------------------------------------------------------- */

export const updatePerformerById = async (id: string, data: Performer) => {
  return prisma.performer.update({
    where: { id },
    data,
  });
};

/* -------------------------------------------------------------------------- */
/*                            Find Performer By Id                             */
/* -------------------------------------------------------------------------- */

export const findPerformerById = async (id: string) => {
  return prisma.performer.findUnique({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                            Find All Performers                              */
/* -------------------------------------------------------------------------- */
export const findAllPerformers = async () => {
  return prisma.performer.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           Search Performers By Name                        */
/* -------------------------------------------------------------------------- */
export const searchPerformersByName = async (
  query: string,
  limit = 10
): Promise<PerformerSummaryOutput[]> => {
  return prisma.performer.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
};
