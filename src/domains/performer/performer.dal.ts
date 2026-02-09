"use server";

import {
  Performer,
  PerformerSummary,
} from "@/domains/performer/performer.schema";
import prisma from "@/lib/prisma";
import { FindPerformerParams } from "@/types/performer.types";
import { slugify } from "@/utils/slugify";

/* -------------------------------------------------------------------------- */
/*                            Add Performer                                   */
/* -------------------------------------------------------------------------- */

export const createPerformer = async (data: Performer) => {
  return prisma.performer.create({
    data: { ...data, slug: slugify(data.name) },
  });
};

/* -------------------------------------------------------------------------- */
/*                            Update Performer                                */
/* -------------------------------------------------------------------------- */

export const updatePerformerById = async (id: string, data: Performer) => {
  return prisma.performer.update({
    where: { id },
    data: { ...data, slug: slugify(data.name) },
  });
};

/* -------------------------------------------------------------------------- */
/*                      Find Performer By Both Id or Slug                     */
/* -------------------------------------------------------------------------- */

export const findPerformer = async ({ id, slug }: FindPerformerParams) => {
  return prisma.performer.findFirst({
    where: {
      ...(id && { id }),
      ...(slug && { slug }),
    },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      role: true,
    },
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
      slug: true,
      role: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           Search Performers By Name                        */
/* -------------------------------------------------------------------------- */
export const searchPerformersByName = async (
  query: string,
  limit = 10
): Promise<PerformerSummary[]> => {
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
      role: true,
    },
  });
};
