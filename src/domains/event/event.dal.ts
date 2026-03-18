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
      status: data.status,
      city: data.city ?? null,
      cityToBeAnnounced: data.cityToBeAnnounced,
      performerToBeAnnounced: data.performerToBeAnnounced,
      venueToBeAnnounced: data.venueToBeAnnounced,
      scheduleToBeAnnounced: data.scheduleToBeAnnounced,
      startAt: data.startAt ?? null,
      endAt: data.endAt ?? null,

      // ✅ connect by ids
      categories: {
        connect: data.categoryIds.map((id) => ({ id })),
      },

      venue: data.venueId
        ? {
            connect: { id: data.venueId },
          }
        : undefined,

      performers: data.performerIds?.length
        ? {
            connect: data.performerIds.map((id) => ({ id })),
          }
        : undefined,

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
      status: data.status,
      city: data.city ?? null,
      cityToBeAnnounced: data.cityToBeAnnounced,
      performerToBeAnnounced: data.performerToBeAnnounced,
      venueToBeAnnounced: data.venueToBeAnnounced,
      scheduleToBeAnnounced: data.scheduleToBeAnnounced,
      startAt: data.startAt ?? null,
      endAt: data.endAt ?? null,

      categories: {
        set: data.categoryIds.map((id) => ({ id })),
      },

      venue:
        data.venueId && !data.venueToBeAnnounced
          ? {
              connect: { id: data.venueId },
            }
          : data.venueToBeAnnounced
            ? {
                disconnect: true,
              }
            : undefined,

      performers: data.performerIds?.length
        ? {
            set: data.performerIds.map((id) => ({ id })),
          }
        : data.performerToBeAnnounced
          ? {
              set: [],
            }
          : undefined,

      // replace images
      images: data.images
        ? {
            deleteMany: {},
            create: data.images.map((url) => ({ url })),
          }
        : undefined,
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
      cityToBeAnnounced: true,
      performerToBeAnnounced: true,
      venueToBeAnnounced: true,
      scheduleToBeAnnounced: true,
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

export const findEvents = async ({
  id,
  slug,
  performerId,
  categoryId,
  categoryIds,
  city,
  status,
  take,
  sort,
  near,
}: FindEventsOptions) => {
  const orderBy =
    sort === "name"
      ? ({ name: "asc" } as const)
      : // date + distance fallback (distance not supported yet)
        ({ startAt: "asc" } as const);

  const events = await prisma.event.findMany({
    take,
    where: {
      ...(id && { id }),
      ...(slug && { slug }),
      ...(performerId && { performers: { some: { id: performerId } } }),
      ...(categoryId && { categories: { some: { id: categoryId } } }),
      ...(categoryIds?.length && {
        categories: { some: { id: { in: categoryIds } } },
      }),
      ...(city && { city }),
      ...(status && { status }),
    },
    orderBy,
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
      venue: {
        select: {
          id: true,
          name: true,
          address: true,
          city: true,
          state: true,
          country: true,
          pincode: true,
          lat: true,
          lng: true,
        },
      },
      status: true,
      ticketTypes: { select: { price: true } },
    },
  });

  const haversineKm = (
    a: { lat: number; lng: number },
    b: { lat: number; lng: number }
  ) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;

    const x =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    return 2 * R * Math.asin(Math.sqrt(x));
  };

  if (sort === "price-low" || sort === "price-high") {
    const dir = sort === "price-low" ? 1 : -1;
    return [...events].sort((a, b) => {
      const aMin = a.ticketTypes.reduce<number>(
        (min, t) => Math.min(min, Number(t.price)),
        Number.POSITIVE_INFINITY
      );
      const bMin = b.ticketTypes.reduce<number>(
        (min, t) => Math.min(min, Number(t.price)),
        Number.POSITIVE_INFINITY
      );
      return (aMin - bMin) * dir;
    });
  }

  if (sort === "distance" && near) {
    return [...events].sort((a, b) => {
      const aHas =
        a.venue && Number.isFinite(a.venue.lat) && Number.isFinite(a.venue.lng);
      const bHas =
        b.venue && Number.isFinite(b.venue.lat) && Number.isFinite(b.venue.lng);

      // push missing-coords venues to bottom
      if (!aHas && !bHas) return 0;
      if (!aHas) return 1;
      if (!bHas) return -1;

      const aD = haversineKm(near, {
        lat: a.venue!.lat!,
        lng: a.venue!.lng!,
      });
      const bD = haversineKm(near, {
        lat: b.venue!.lat!,
        lng: b.venue!.lng!,
      });
      return aD - bD;
    });
  }

  return events;
};
