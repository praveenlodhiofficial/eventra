"use server";

import { Event } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export const createEvent = async (
   params: Pick<
      Omit<Event, "slug">,
      | "name"
      | "description"
      | "startDate"
      | "endDate"
      | "location"
      | "eventType"
      | "ticketType"
      | "coverImageUrl"
      | "imageUrl"
   >
) => {
   const {
      name,
      description,
      startDate,
      endDate,
      location,
      eventType,
      ticketType,
      coverImageUrl,
      imageUrl,
   } = params;

   try {
      const event = await prisma.event.create({
         data: {
            name,
            slug: generateSlug(name),
            description,
            startDate,
            endDate,
            location,
            eventType,
            ticketType,
            coverImageUrl: coverImageUrl || null,
            imageUrl: imageUrl || [],
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

export const getEvent = async (slug: string) => {
   try {
      const event = await prisma.event.findUnique({
         where: {
            slug,
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

export const getAllEvents = async () => {
   try {
      const events = await prisma.event.findMany();

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

export const updateEvent = async (
   params: Pick<
      Event,
      | "id"
      | "name"
      | "description"
      | "startDate"
      | "endDate"
      | "location"
      | "eventType"
      | "ticketType"
      | "coverImageUrl"
      | "imageUrl"
   >
) => {
   const {
      id,
      name,
      description,
      startDate,
      endDate,
      location,
      eventType,
      ticketType,
      coverImageUrl,
      imageUrl,
   } = params;

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
            name,
            description,
            startDate,
            endDate,
            location,
            eventType,
            ticketType,
            coverImageUrl: coverImageUrl || null,
            imageUrl: imageUrl || [],
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
