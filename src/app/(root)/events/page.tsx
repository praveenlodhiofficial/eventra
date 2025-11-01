import EventCard from "@/components/EventCard";
import EventCarousel from "@/components/EventCarousel";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/features/event";
import { categoryToSubCategories } from "@/lib/event-categories";
import Image from "next/image";
import Link from "next/link";
import { PiSlidersHorizontalBold } from "react-icons/pi";

export default async function EventsPage() {
   const { data, success, message } = await getAllEvents();
   const events = data || [];

   if (!success) return <div>{message}</div>;
   return (
      <>
         <EventCarousel />
         <div className="mt-15 w-full space-y-15 p-3 md:p-5 lg:px-10">
            {/* ==================================================== Explore Events Categories Section ==================================================== */}
            <div className="space-y-5">
               <h1 className="text-2xl font-semibold capitalize md:text-3xl">Explore Events</h1>

               <div className="flex w-full flex-wrap gap-3 md:gap-5">
                  {Object.entries(categoryToSubCategories).map(([category]) => (
                     <Link
                        href={`/events/categories/${category.toLowerCase()}`}
                        key={category.toLowerCase()}
                        className="flex h-55 w-43 flex-col items-center justify-center overflow-hidden rounded-lg border bg-gray-100 p-4 transition-all duration-300 hover:shadow-lg md:rounded-2xl"
                     >
                        <h1 className="text-center text-lg capitalize">
                           {category.toLowerCase().replace("_", " ")}
                        </h1>
                     </Link>
                  ))}
               </div>
            </div>

            {/* ==================================================== Event Contributors Section ==================================================== */}
            <div className="space-y-5">
               <h1 className="text-2xl font-semibold capitalize md:text-3xl">Explore Artists</h1>

               <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto pb-2 md:gap-5">
                  {events
                     .flatMap((event) => event.contributors)
                     .map((contributor) => (
                        <Link
                           href={`/events/contributors/${contributor.id}`}
                           key={contributor.id}
                           className="flex flex-shrink-0 flex-col items-center gap-2"
                        >
                           <div className="relative overflow-hidden rounded-full">
                              <Image
                                 src={contributor.imageUrl || ""}
                                 alt={contributor.name || "Contributor Image"}
                                 width={300}
                                 height={300}
                                 className="h-30 w-30 rounded-full object-cover md:h-40 md:w-40 lg:h-50 lg:w-50"
                              />
                           </div>
                           <h1 className="text-center text-sm whitespace-nowrap text-black md:text-base">
                              {contributor.name}
                           </h1>
                        </Link>
                     ))}
               </div>
            </div>

            {/* ==================================================== ALL EVENTS SECTION ==================================================== */}
            <div className="space-y-5">
               <h1 className="text-2xl font-semibold capitalize md:text-3xl">All Events</h1>

               {/* Filter Section ---------------------------------------------------------------> */}
               <div className="scrollbar-hide flex items-center justify-between overflow-x-auto">
                  <div className="flex items-center gap-1.5 whitespace-nowrap md:gap-3">
                     <Button variant="outline" className="cursor-pointer border-black text-xs">
                        <PiSlidersHorizontalBold className="size-3 md:size-4" />
                        Filters
                     </Button>
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
               <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-10">
                  {events.map((event) => (
                     <EventCard key={event.id} event={event} />
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}
