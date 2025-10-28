"use server";

import { Event, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// ============================================== CREATE EVENT ==============================================
export const createEvent = async (
   params: Omit<Prisma.EventCreateInput, "id" | "slug" | "createdAt" | "updatedAt"> & {
      contributors?: Omit<
         Prisma.EventContributorCreateWithoutEventInput,
         "id" | "createdAt" | "updatedAt"
      >[];
   }
) => {
   const { contributors, ...eventData } = params;

   try {
      const event = await prisma.event.create({
         data: {
            ...eventData,
            slug: generateSlug(eventData.name),
            contributors: contributors
               ? {
                    create: contributors.map((c) => ({
                       name: c.name,
                       imageUrl: c.imageUrl,
                       description: c.description,
                       contributorRole: c.contributorRole,
                    })),
                 }
               : undefined,
         },
         include: {
            contributors: true,
         },
      });

      return {
         success: true,
         message: "Event created successfully",
         data: event,
      };
   } catch (error) {
      console.error("Event creation failed", error);

      return {
         success: false,
         message: "Event creation failed",
      };
   }
};

// ============================================== GET EVENT ==============================================
export const getEvent = async (slug: string) => {
   try {
      const event = await prisma.event.findUnique({
         where: {
            slug,
         },
         include: {
            contributors: true,
         },
      });

      if (!event) {
         return {
            success: false,
            message: "Event not found",
         };
      }

      return {
         success: true,
         message: "Event fetched successfully",
         event: event,
      };
   } catch (error) {
      console.error("Event fetching failed", error);

      return {
         success: false,
         message: "Event fetching failed",
      };
   }
};

// ============================================== GET ALL EVENTS ==============================================
export const getAllEvents = async () => {
   try {
      const events = await prisma.event.findMany({
         include: {
            contributors: true,
         },
      });

      return {
         success: true,
         message: "All events fetched successfully",
         data: events,
      };
   } catch (error) {
      console.error("All events fetching failed", error);

      return {
         success: false,
         message: "All events fetching failed",
      };
   }
};

// ============================================== GET FEATURED EVENTS (CAROUSEL) ==============================================
export const getFeaturedEvents = async () => {
   try {
      const featuredEvents = await prisma.event.findMany({
         where: {
            startDate: {
               gte: new Date(),
            },
         },
         take: 5,
      });

      return {
         success: true,
         message: "Featured events fetched successfully",
         data: featuredEvents,
      };
   } catch (error) {
      console.error("Featured events fetching failed", error);
      return {
         success: false,
         message: "Unable to fetch featured events",
      };
   }
};

// ============================================== UPDATE EVENT ==============================================
export const updateEvent = async (
   params: Pick<Event, "id"> & {
      data: Omit<Prisma.EventUpdateInput, "id" | "slug" | "createdAt" | "updatedAt"> & {
         contributors?: Omit<
            Prisma.EventContributorCreateWithoutEventInput,
            "id" | "createdAt" | "updatedAt"
         >[];
      };
   }
) => {
   const { id, data } = params;
   const { contributors, ...eventData } = data;

   try {
      const doesEventExist = await prisma.event.findUnique({
         where: {
            id,
         },
      });

      if (!doesEventExist) {
         return {
            success: false,
            message: "Event not found",
         };
      }

      const event = await prisma.event.update({
         where: {
            id,
         },
         data: {
            ...eventData,
            contributors: contributors
               ? {
                    deleteMany: {}, // Delete all existing contributors (cascading deletion)
                    create: contributors.map((c) => ({
                       name: c.name,
                       imageUrl: c.imageUrl,
                       description: c.description,
                       contributorRole: c.contributorRole,
                    })),
                 }
               : undefined,
         },
         include: {
            contributors: true,
         },
      });

      return {
         success: true,
         message: "Event updated successfully",
         data: event,
      };
   } catch (error) {
      console.error("Event updating failed", error);

      return {
         success: false,
         message: "Event updating failed",
      };
   }
};

// ============================================== DELETE EVENT ==============================================
export const deleteEvent = async (params: Pick<Event, "id">) => {
   const { id } = params;

   try {
      const doesEventExist = await prisma.event.findUnique({
         where: {
            id,
         },
      });

      if (!doesEventExist) {
         return {
            success: false,
            message: "Event not found",
         };
      }

      /*
       * Cascading deletion is handled by the onDelete: Cascade rules in the schema.
       * This means that when an event is deleted, all related records (contributors, feedback, tickets, calendar) will also be deleted.
       * No need to manually delete related records.
       */

      const event = await prisma.event.delete({
         where: {
            id,
         },
      });

      return {
         success: true,
         message: "Event deleted successfully",
         data: event,
      };
   } catch (error) {
      console.error("Event deletion failed", error);

      return {
         success: false,
         message: "Event deletion failed",
      };
   }
};
