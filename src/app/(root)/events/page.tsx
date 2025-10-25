import { PiSlidersHorizontalBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/features/event";
import { formatEventDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function EventsPage() {
   const { data, success, message } = await getAllEvents();
   const events = data || [];

   if (!success) return <div>{message}</div>;
   return (
      <div className="p-10">
         <div className="space-y-5">
            <h1 className="text-3xl font-semibold capitalize">All Events</h1>

            {/* Filter Section ---------------------------------------------------------------> */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <Button variant="outline" className="cursor-pointer border-black">
                     <PiSlidersHorizontalBold className="size-4" />
                     Filters
                  </Button>
                  <Button variant="outline" className="cursor-pointer border-black">
                     Today
                  </Button>
                  <Button variant="outline" className="cursor-pointer border-black">
                     Tomorrow
                  </Button>
                  <Button variant="outline" className="cursor-pointer border-black">
                     Under 10 km
                  </Button>
                  <Button variant="outline" className="cursor-pointer border-black">
                     Comedy
                  </Button>
                  <Button variant="outline" className="cursor-pointer border-black">
                     Standup
                  </Button>
               </div>
            </div>

            {/* All Events Section ---------------------------------------------------------------> */}
            <div className="grid grid-cols-4 gap-10">
               {events.map((event) => (
                  <Link
                     href={`/events/${event.slug}`}
                     key={event.id}
                     className="overflow-hidden rounded-2xl border bg-gray-50"
                  >
                     <Image
                        src={event.coverImageUrl || ""}
                        alt={event.name || "Event Image"}
                        width={1000}
                        height={1000}
                        className="aspect-auto h-[50vh] w-full object-cover"
                     />

                     <div className="space-y-0.5 p-4 text-[13px] text-gray-500">
                        <p className="text-[#8B8123]">
                           {formatEventDateTime(new Date(event.startDate || new Date()))}
                        </p>
                        <h1 className="text-lg font-semibold text-black capitalize">
                           {event.name}
                        </h1>
                        <p>{event.location}</p>
                        <p>₹3000 onwards</p>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </div>
   );
}
