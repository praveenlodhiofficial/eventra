"use client";

import EventCard from "@/components/EventCard";
import { FilterEventsButton } from "@/components/filter.dialog";
import { Button } from "@/components/ui/button";
import { filterEvents, getAllEvents } from "@/features/event";
import { EventSubCategory } from "@/generated/prisma";
import { useState, useTransition } from "react";

type EventType = NonNullable<Awaited<ReturnType<typeof getAllEvents>>["data"]>[0];

interface EventsListProps {
   initialEvents: EventType[];
}

export function EventsList({ initialEvents }: EventsListProps) {
   const [events, setEvents] = useState<EventType[]>(initialEvents);
   const [isFiltered, setIsFiltered] = useState(false);
   const [isPending, startTransition] = useTransition();

   const handleApplyFilters = async (filters: {
      sortOptions: string[];
      subCategories: EventSubCategory[];
   }) => {
      startTransition(async () => {
         // If no filters are applied, show all events
         if (filters.sortOptions.length === 0 && filters.subCategories.length === 0) {
            setEvents(initialEvents);
            setIsFiltered(false);
            return;
         }

         // Apply filters
         const result = await filterEvents({
            sortOptions: filters.sortOptions,
            subCategories: filters.subCategories,
         });

         if (result.success && result.data) {
            setEvents(result.data);
            setIsFiltered(true);
         } else {
            // On error, show all events
            setEvents(initialEvents);
            setIsFiltered(false);
         }
      });
   };

   return (
      <div className="space-y-5">
         <h1 className="text-2xl font-semibold capitalize md:text-3xl">All Events</h1>

         {/* Filter Section ---------------------------------------------------------------> */}
         <div className="scrollbar-hide flex items-center justify-between overflow-x-auto">
            <div className="flex items-center gap-1.5 whitespace-nowrap md:gap-3">
               <FilterEventsButton onApply={handleApplyFilters} />
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Today
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Tomorrow
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Under 10 km
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Comedy
               </Button>
               <Button variant="outline" className="cursor-pointer border-black text-xs">
                  Standup
               </Button>
            </div>
         </div>

         {/* All Events Section ---------------------------------------------------------------> */}
         {isPending ? (
            <div className="flex items-center justify-center py-10">
               <p className="text-gray-500">Loading filtered events...</p>
            </div>
         ) : (
            <>
               {events.length === 0 ? (
                  <div className="flex items-center justify-center py-10">
                     <p className="text-gray-500">
                        {isFiltered
                           ? "No events found matching your filters."
                           : "No events available."}
                     </p>
                  </div>
               ) : (
                  <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-10">
                     {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                     ))}
                  </div>
               )}
            </>
         )}
      </div>
   );
}
