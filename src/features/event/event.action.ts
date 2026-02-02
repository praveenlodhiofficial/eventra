"use server";

import { Event, EventSubCategory, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

// ============================================== CREATE EVENT ==============================================
export const createEvent = async (
   params: Omit<Prisma.EventCreateInput, "id" | "slug" | "createdAt" | "updatedAt"> & {
      contributors?: Omit<
         Prisma.EventContributorCreateWithoutEventInput,
         "id" | "createdAt" | "updatedAt"
      >[];
      tickets?: Omit<Prisma.TicketCreateWithoutEventInput, "id" | "createdAt" | "updatedAt">[];
   }
) => {
   const { contributors, tickets, ...eventData } = params;

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
            ticket: tickets
               ? {
                    create: tickets.map((t) => ({
                       ticketType: t.ticketType,
                       category: t.category,
                       guidelines: t.guidelines || undefined,
                       price: t.price,
                       quantity: t.quantity,
                    })),
                 }
               : undefined,
         },
         include: {
            contributors: true,
            ticket: true,
         },
      });

      return {
         success: true,
         message: "Event created successfully",
         data: event,
      };
   } catch (error) {
      console.error("Event creation failed", error);
      // Prisma unique constraint violation (e.g., slug)
      if ((error as { code?: string })?.code === "P2002") {
         return {
            success: false,
            message: "An event with a similar name already exists. Please use a different name.",
         };
      }
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
            ticket: true,
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
            ticket: true,
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

// ============================================== GET EVENTS BY CATEGORY ==============================================
export const getEventsByCategory = async (category: Event["category"]) => {
   try {
      const events = await prisma.event.findMany({
         where: {
            category: category,
         },
         include: {
            contributors: true,
            ticket: true,
         },
      });

      return {
         success: true,
         message: "Events fetched successfully",
         data: events,
      };
   } catch (error) {
      console.error("Events fetching by category failed", error);

      return {
         success: false,
         message: "Events fetching by category failed",
         data: [],
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
         orderBy: {
            startDate: "asc",
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
         data: [],
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
         tickets?: Omit<Prisma.TicketCreateWithoutEventInput, "id" | "createdAt" | "updatedAt">[];
      };
   }
) => {
   const { id, data } = params;
   const { contributors, tickets, ...eventData } = data;

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
            ticket: tickets
               ? {
                    deleteMany: {}, // Delete all existing tickets (cascading deletion)
                    create: tickets.map((t) => ({
                       ticketType: t.ticketType,
                       category: t.category,
                       guidelines: t.guidelines || undefined,
                       price: t.price,
                       quantity: t.quantity,
                    })),
                 }
               : undefined,
         },
         include: {
            contributors: true,
            ticket: true,
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

// ============================================== FILTER EVENTS ==============================================
export interface FilterEventsParams {
   sortOptions?: string[]; // Array of sort option IDs (e.g., ["date-newest", "price-low"])
   subCategories?: EventSubCategory[]; // Array of subcategories to filter by
}

export const filterEvents = async (params: FilterEventsParams = {}) => {
   const { sortOptions = [], subCategories = [] } = params;

   try {
      // Build where clause for subcategory filtering
      const where: Prisma.EventWhereInput = {};
      if (subCategories.length > 0) {
         where.subCategory = {
            in: subCategories,
         };
      }

      // Build orderBy clause based on sort options
      // If multiple sort options are selected, use the first one
      const primarySortOption = sortOptions[0];
      let orderBy:
         | Prisma.EventOrderByWithRelationInput
         | Prisma.EventOrderByWithRelationInput[]
         | undefined = undefined;
      let needsInMemorySort = false;

      switch (primarySortOption) {
         case "date-newest":
            orderBy = { startDate: "desc" };
            break;
         case "date-oldest":
            orderBy = { startDate: "asc" };
            break;
         case "name-asc":
            orderBy = { name: "asc" };
            break;
         case "name-desc":
            orderBy = { name: "desc" };
            break;
         case "popularity":
            // Sort by feedback count (most feedback = most popular)
            // We'll need to fetch events and sort them in memory for this
            needsInMemorySort = true;
            break;
         case "price-low":
         case "price-high":
            // Price sorting requires getting min/max from tickets
            // We'll handle this in memory after fetching
            needsInMemorySort = true;
            break;
         default:
            // Default to newest first
            orderBy = { startDate: "desc" };
      }

      // Fetch events with all necessary relations
      let events = await prisma.event.findMany({
         where,
         include: {
            contributors: true,
            ticket: true,
            feedBack: {
               select: {
                  id: true,
               },
            },
         },
         orderBy: orderBy || { startDate: "desc" },
      });

      // Handle sorting that requires in-memory processing
      if (
         needsInMemorySort &&
         (primarySortOption === "price-low" || primarySortOption === "price-high")
      ) {
         events = events.sort((a, b) => {
            // Get minimum price from tickets (or 0 if no tickets)
            const getMinPrice = (event: (typeof events)[0]) => {
               if (!event.ticket || event.ticket.length === 0) return 0;
               return Math.min(...event.ticket.map((t) => t.price));
            };

            const priceA = getMinPrice(a);
            const priceB = getMinPrice(b);

            if (primarySortOption === "price-low") {
               return priceA - priceB;
            } else {
               return priceB - priceA;
            }
         });
      } else if (needsInMemorySort && primarySortOption === "popularity") {
         events = events.sort((a, b) => {
            const feedbackCountA = a.feedBack?.length || 0;
            const feedbackCountB = b.feedBack?.length || 0;
            return feedbackCountB - feedbackCountA; // Descending (most popular first)
         });
      }

      // Remove feedBack from the response (we only needed it for sorting)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const eventsWithoutFeedback = events.map(({ feedBack: _feedBack, ...event }) => event);

      return {
         success: true,
         message: "Events filtered successfully",
         data: eventsWithoutFeedback,
      };
   } catch (error) {
      console.error("Event filtering failed", error);

      return {
         success: false,
         message: "Event filtering failed",
         data: [],
      };
   }
};
