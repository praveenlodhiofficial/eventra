"use server";

import { z } from "zod";

import prisma from "@/lib/prisma";

import { EventCategoryEnum, EventInput, EventSchema } from "./event.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Event Action                             */
/* -------------------------------------------------------------------------- */

export const CreateEventAction = async (input: EventInput) => {
  try {
    const parsed = EventSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const event = await prisma.event.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        coverImage: parsed.data.coverImage,
        categories: {
          connect: parsed.data.category.map((name) => ({ name })),
        },
        city: parsed.data.city,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        price: parsed.data.price,
        venue: {
          connect: { id: parsed.data.venueId },
        },
        performers: {
          connect: parsed.data.performerIds.map((id) => ({ id })),
        },
        images: parsed.data.imageUrls
          ? {
              create: parsed.data.imageUrls.map((url) => ({ url })),
            }
          : undefined,
      },
      include: {
        categories: true,
        venue: true,
        performers: true,
        images: true,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Event created successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Get All Events Action                           */
/* -------------------------------------------------------------------------- */

export const GetEventsAction = async (filters?: {
  category?: string;
  city?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        ...(filters?.category && {
          categories: {
            some: {
              name: filters.category,
            },
          },
        }),
        ...(filters?.city && { city: filters.city }),
        ...(filters?.startDate && {
          startDate: { gte: filters.startDate },
        }),
        ...(filters?.endDate && {
          endDate: { lte: filters.endDate },
        }),
      },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                          Get Event By ID Action                            */
/* -------------------------------------------------------------------------- */

export const GetEventByIdAction = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
    });

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event fetched successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                          Get Event By Slug Action                          */
/* -------------------------------------------------------------------------- */

export const GetEventBySlugAction = async (slug: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
    });

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Event fetched successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Update Event Action                             */
/* -------------------------------------------------------------------------- */

export const UpdateEventAction = async (
  id: string,
  input: Partial<EventInput>
) => {
  try {
    const parsed = EventSchema.partial().safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid event data",
        errors: z.treeifyError(parsed.error),
      };
    }

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.slug && { slug: parsed.data.slug }),
        ...(parsed.data.description && {
          description: parsed.data.description,
        }),
        ...(parsed.data.coverImage && { coverImage: parsed.data.coverImage }),
        ...(parsed.data.category && { category: parsed.data.category }),
        ...(parsed.data.city && { city: parsed.data.city }),
        ...(parsed.data.startDate && { startDate: parsed.data.startDate }),
        ...(parsed.data.endDate && { endDate: parsed.data.endDate }),
        ...(parsed.data.price !== undefined && { price: parsed.data.price }),
        ...(parsed.data.venueId && {
          venue: { connect: { id: parsed.data.venueId } },
        }),
        ...(parsed.data.performerIds && {
          performers: {
            set: [],
            connect: parsed.data.performerIds.map((id) => ({ id })),
          },
        }),
        ...(parsed.data.imageUrls && {
          images: {
            deleteMany: {},
            create: parsed.data.imageUrls.map((url) => ({ url })),
          },
        }),
      },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Event updated successfully",
      data: event,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                            Delete Event Action                             */
/* -------------------------------------------------------------------------- */

export const DeleteEventAction = async (id: string) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return {
        success: false,
        status: 404,
        message: "Event not found",
      };
    }

    await prisma.event.delete({
      where: { id },
    });

    return {
      success: true,
      status: 200,
      message: "Event deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                        Get Events By Category Action                       */
/* -------------------------------------------------------------------------- */

export const GetEventsByCategoryAction = async (category: string) => {
  const parsed = EventCategoryEnum.safeParse(category);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid category",
    };
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        categories: {
          some: { name: parsed.data },
        },
      },
      include: {
        categories: true,
        venue: true,
        performers: true,
        images: true,
      },
      orderBy: { startDate: "asc" },
    });

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                          Get Events By City Action                         */
/* -------------------------------------------------------------------------- */

export const GetEventsByCityAction = async (city: string) => {
  try {
    const events = await prisma.event.findMany({
      where: { city },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return {
      success: true,
      status: 200,
      message: "Events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                        Get Upcoming Events Action                          */
/* -------------------------------------------------------------------------- */

export const GetUpcomingEventsAction = async (limit?: number) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
      orderBy: {
        startDate: "asc",
      },
      ...(limit && { take: limit }),
    });

    return {
      success: true,
      status: 200,
      message: "Upcoming events fetched successfully",
      data: events,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                          Search Events Action                              */
/* -------------------------------------------------------------------------- */

export const SearchEventsAction = async (query: string) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        venue: true,
        performers: true,
        images: true,
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return {
      success: true,
      status: 200,
      message: "Search results fetched successfully",
      data: events,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};
