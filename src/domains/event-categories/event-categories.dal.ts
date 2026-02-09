import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

import { EventCategory } from "./event-categories.schema";

/* -------------------------------------------------------------------------- */
/*                           create Event Category                            */
/* -------------------------------------------------------------------------- */

export const createEventCategory = async (data: EventCategory) => {
  return prisma.eventCategory.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           update Event Category                            */
/* -------------------------------------------------------------------------- */

export const updateEventCategory = async (id: string, data: EventCategory) => {
  return prisma.eventCategory.update({
    where: { id },
    data,
  });
};

/* -------------------------------------------------------------------------- */
/*                           Delete Event Category                            */
/* -------------------------------------------------------------------------- */

export const deleteEventCategory = async (id: string) => {
  return prisma.eventCategory.delete({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                            Delete Event Categories                         */
/* -------------------------------------------------------------------------- */

export const deleteEventCategories = async (ids: string[]) => {
  return prisma.eventCategory.deleteMany({
    where: { id: { in: ids } },
  });
};

/* -------------------------------------------------------------------------- */
/*                           Find Event Categories                            */
/* -------------------------------------------------------------------------- */

export const findEventCategories = async () => {
  return prisma.eventCategory.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
};
