import EventCarousel from "@/components/EventCarousel";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/features/event";
import { formatEventDateTime } from "@/lib/utils";
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
         <div className="w-full space-y-10 p-3 md:p-5 lg:px-10">
            <div></div>
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
                     <Link
                        href={`/events/${event.slug}`}
                        key={event.id}
                        className="overflow-hidden rounded-lg border bg-gray-50 md:rounded-2xl"
                     >
                        <Image
                           src={event.coverImageUrl || ""}
                           alt={event.name || "Event Image"}
                           width={1000}
                           height={1000}
                           className="aspect-auto h-[20vh] w-full object-cover md:h-[22vh] lg:h-[50vh]"
                        />

                        <div className="space-y-0.5 p-2 text-[11px] text-gray-500 md:p-4 md:text-[13px]">
                           <p className="text-[#8B8123]">
                              {formatEventDateTime(new Date(event.startDate || new Date()))}
                           </p>
                           <h1 className="line-clamp-2 text-sm font-semibold text-black capitalize md:text-base lg:text-lg">
                              {event.name}
                           </h1>
                           <p className="line-clamp-1">{event.location}</p>
                           <p className="line-clamp-1">₹3000 onwards</p>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}
