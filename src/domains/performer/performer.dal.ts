"use server";

import {
  Performer,
  PerformerSummary,
} from "@/domains/performer/performer.schema";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

import { FindPerformerParams } from "./performer.types";

/* -------------------------------------------------------------------------- */
/*                            Create Performer                                   */
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
/*                               Delete Performer                                */
/* -------------------------------------------------------------------------- */

export const deletePerformer = async (id: string) => {
  return prisma.performer.delete({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                              Delete Performers                                 */
/* -------------------------------------------------------------------------- */

export const deletePerformers = async (ids: string[]) => {
  return prisma.performer.deleteMany({
    where: { id: { in: ids } },
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
      slug: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                      Find Performer With Events                           */
/* -------------------------------------------------------------------------- */

export const findPerformerWithEvents = async ({
  id,
  slug,
}: FindPerformerParams) => {
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
      slug: true,
      events: {
        select: {
          id: true,
          name: true,
          slug: true,
          coverImage: true,
          startAt: true,
          endAt: true,
          venue: {
            select: {
              id: true,
              name: true,
              state: true,
            },
          },
          ticketTypes: {
            select: {
              price: true,
            },
          },
        },
      },
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
      bio: true,
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

/* -------------------------------------------------------------------------- */
/*                        Find Performers By Role                           */
/* -------------------------------------------------------------------------- */
export const findPerformersByRole = async (role: string) => {
  return prisma.performer.findMany({
    where: {
      role: {
        contains: role,
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      role: true,
      bio: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                        Get All Unique Performer Roles                     */
/* -------------------------------------------------------------------------- */
export const getUniquePerformerRoles = async () => {
  const performers = await prisma.performer.findMany({
    distinct: ["role"],
    select: {
      role: true,
    },
  });
  return performers
    .map((p) => p.role)
    .filter(Boolean)
    .sort();
};
