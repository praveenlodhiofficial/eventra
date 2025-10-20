import { Event } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export const createEvent = async (
   params: Pick<
      Event,
      "name" | "description" | "startDate" | "endDate" | "location" | "EventType" | "TicketType"
   >
) => {
   const { name, description, startDate, endDate, location, EventType, TicketType } = params;

   try {
      const event = await prisma.event.create({
         data: {
            name,
            description,
            startDate,
            endDate,
            location,
            EventType,
            TicketType,
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

export const getEvents = async (params: Pick<Event, "id">) => {
   const { id } = params;

   try {
      const event = await prisma.event.findUnique({
         where: {
            id,
         },
      });

      return {
         success: true,
         message: "Event fetched successfully",
         data: event,
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
      | "EventType"
      | "TicketType"
   >
) => {
   const { id, name, description, startDate, endDate, location, EventType, TicketType } = params;

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
            EventType,
            TicketType,
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
