import EventCard from "@/components/EventCard";
import EventCarousel from "@/components/EventCarousel";
import { getEventsByCategory } from "@/features/event/event.action";
import { EventCategory } from "@/generated/prisma";
import { categoryLabels } from "@/lib/event-categories";

export default async function EventsCategoryPage({
   params,
}: {
   params: Promise<{ slug: string }>;
}) {
   const { slug } = await params;

   // Convert slug to EventCategory enum format (e.g., "entertainment_music" -> "ENTERTAINMENT_MUSIC")
   const categoryEnum = slug.toUpperCase().replace(/-/g, "_") as EventCategory;

   const { data, success, message } = await getEventsByCategory(categoryEnum);
   const events = data || [];

   // Get category label for display
   const categoryLabel = categoryLabels[categoryEnum] || slug.replace(/_/g, " ").replace(/-/g, " ");

   if (!success) {
      return (
         <>
            <EventCarousel />
            <div className="mt-15 w-full p-3 md:p-5 lg:px-10">
               <h1 className="mb-5 text-2xl font-semibold capitalize md:text-3xl">
                  {categoryLabel}
               </h1>
               <div className="text-gray-600">{message}</div>
            </div>
         </>
      );
   }

   return (
      <>
         <EventCarousel />
         <div className="mt-15 w-full space-y-15 p-3 md:p-5 lg:px-10">
            <div className="space-y-5">
               <h1 className="text-2xl font-semibold capitalize md:text-3xl">{categoryLabel}</h1>

               {events.length === 0 ? (
                  <div className="text-gray-600">No events found in this category.</div>
               ) : (
                  <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-10">
                     {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                     ))}
                  </div>
               )}
            </div>
         </div>
      </>
   );
}
