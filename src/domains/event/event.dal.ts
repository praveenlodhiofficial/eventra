import prisma from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

import { Event } from "./event.schema";
import { FindEventParams, FindEventsOptions } from "./event.types";

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
      startAt: data.startAt,
      endAt: data.endAt,

      // ✅ connect by ids
      categories: {
        connect: data.categoryIds.map((id) => ({ id })),
      },

      venue: {
        connect: { id: data.venueId },
      },

      performers: {
        connect: data.performerIds.map((id) => ({ id })),
      },

      // ✅ create image records
      images: data.images?.length
        ? {
            create: data.images.map((url) => ({ url })),
          }
        : undefined,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                                Update Event                               */
/* -------------------------------------------------------------------------- */

export const updateEventById = async (id: string, data: Event) => {
  return prisma.event.update({
    where: { id },
    data: {
      name: data.name,
      slug: slugify(data.name),
      description: data.description,
      coverImage: data.coverImage,
      city: data.city,
      startAt: data.startAt,
      endAt: data.endAt,

      categories: {
        set: data.categoryIds.map((id) => ({ id })),
      },

      venue: {
        connect: { id: data.venueId },
      },

      performers: {
        set: data.performerIds.map((id) => ({ id })),
      },

      // replace images
      images: {
        deleteMany: {},
        create: data.images?.map((url) => ({ url })) ?? [],
      },
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                      Find Event By Both Id or Slug                     */
/* -------------------------------------------------------------------------- */

export const findEvent = async ({ id, slug }: FindEventParams) => {
  return prisma.event.findFirst({
    where: {
      ...(id && { id }),
      ...(slug && { slug }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      coverImage: true,
      images: true,
      categories: true,
      city: true,
      performers: true,
      startAt: true,
      endAt: true,
      venue: true,
      status: true,
      ticketTypes: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
        },
      },
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                               Delete Event                                */
/* -------------------------------------------------------------------------- */

export const deleteEvent = async (id: string) => {
  return prisma.event.delete({
    where: { id },
  });
};

/* -------------------------------------------------------------------------- */
/*                              Delete Events                                 */
/* -------------------------------------------------------------------------- */

export const deleteEvents = async (ids: string[]) => {
  return prisma.event.deleteMany({
    where: { id: { in: ids } },
  });
};

/* -------------------------------------------------------------------------- */
/*                               Find Events                                  */
/* -------------------------------------------------------------------------- */

export const findEvents = async (options?: FindEventsOptions) => {
  return prisma.event.findMany({
    where: {
      ...(options?.status && { status: options.status }),
    },
    orderBy: {
      startAt: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      coverImage: true,
      images: true,
      categories: true,
      city: true,
      performers: true,
      startAt: true,
      endAt: true,
      venue: true,
      status: true,
    },
  });
};
