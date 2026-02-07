import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

import { Event } from "./event.schema";

/* -------------------------------------------------------------------------- */
/*                                   Create                                   */
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
/*                                    Read                                    */
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

export const findEventBySlug = async (slug: string) => {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      venue: true,
      performers: true,
      images: true,
      categories: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                                   Update                                   */
/* -------------------------------------------------------------------------- */

export const updateEventById = async (id: string, data: Partial<Event>) => {
  return prisma.event.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.coverImage && { coverImage: data.coverImage }),
      ...(data.city && { city: data.city }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.price !== undefined && { price: data.price }),

      ...(data.venueId && {
        venue: { connect: { id: data.venueId } },
      }),

      ...(data.imageUrls && {
        images: {
          deleteMany: {},
          create: data.imageUrls.map((url) => ({ url })),
        },
      }),
    },
    include: {
      venue: true,
      performers: true,
      images: true,
      categories: true,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                                   Delete                                   */
/* -------------------------------------------------------------------------- */

export const deleteEventById = async (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                                 Upcoming                                   */
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
