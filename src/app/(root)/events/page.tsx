import EventCarousel from "@/components/EventCarousel";
import { EventsList } from "@/components/EventsList";
import { getAllEvents } from "@/features/event";
import { categoryToSubCategories } from "@/lib/event-categories";
import Image from "next/image";
import Link from "next/link";

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
                        <h1 className="text-center capitalize">
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

            {/* ==================================================== EVENTS LIST SECTION ==================================================== */}
            <EventsList initialEvents={events} />
         </div>
      </>
   );
}
