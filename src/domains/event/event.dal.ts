import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

import { Event } from "./event.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Event                                    */
/* -------------------------------------------------------------------------- */
export const createEvent = async (data: Event) => {
  return prisma.event.create({
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      coverImage: data.coverImage,
      city: data.city,
      startDate: data.startDate,
      endDate: data.endDate,
      price: new Prisma.Decimal(data.price),

      categories: {
        connect: data.category.map((name) => ({ name })),
      },

      venue: {
        connect: { id: data.venueId },
      },

      performers: {
        connect: data.performerIds.map((id) => ({ id })),
      },

      images: data.imageUrls
        ? {
            create: data.imageUrls.map((url) => ({ url })),
          }
        : undefined,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           find Events By Filter                            */
/* -------------------------------------------------------------------------- */

export const findEvents = async (filters?: {
  category?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  return prisma.event.findMany({
    where: {
      ...(filters?.category && {
        categories: { some: { name: filters.category } },
      }),
      ...(filters?.city && { city: filters.city }),
      ...(filters?.startDate && { startDate: { gte: filters.startDate } }),
      ...(filters?.endDate && { endDate: { lte: filters.endDate } }),
    },
    include: {
      venue: true,
      performers: true,
      images: true,
    },
    orderBy: { startDate: "asc" },
  });
};

/* -------------------------------------------------------------------------- */
/*                             find Event By Id                                */
/* -------------------------------------------------------------------------- */

export const findEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      performers: true,
      images: true,
      categories: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                             find Event By Slug                              */
/* -------------------------------------------------------------------------- */

export const findEventBySlug = async (slug: string) => {
  return prisma.event.findUnique({
    where: { slug },
    select: {
      venue: {
        select: {
          id: true,
          name: true,
        },
      },
      performers: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          url: true,
        },
      },
      categories: {
        select: {
          name: true,
        },
      },
      name: true,
      city: true,
      startDate: true,
      endDate: true,
      price: true,
      slug: true,
      coverImage: true,
      description: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                             update Event By Id                              */
/* -------------------------------------------------------------------------- */

export const updateEventById = async (id: string, data: Event) => {
  return prisma.event.update({
    where: { id },
    data,
  });
};

/* -------------------------------------------------------------------------- */
/*                             delete Event By Id                              */
/* -------------------------------------------------------------------------- */

export const deleteEventById = async (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                             find Upcoming Events                            */
/* -------------------------------------------------------------------------- */

export const findUpcomingEvents = async (limit?: number) => {
  return prisma.event.findMany({
    where: {
      startDate: { gte: new Date() },
    },
    include: {
      venue: true,
      performers: true,
      images: true,
    },
    orderBy: { startDate: "asc" },
    ...(limit && { take: limit }),
  });
};

/* -------------------------------------------------------------------------- */
/*                            Find All Events                                 */
/* -------------------------------------------------------------------------- */

export const findAllEvents = async () => {
  return prisma.event.findMany({
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      startDate: true,
      endDate: true,
      price: true,
      venue: {
        select: {
          id: true,
          name: true,
        },
      },
      city: true,
    },
  });
};
