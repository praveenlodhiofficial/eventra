import { AdminEventsTable, EventFormModalButton, getAllEvents } from "@/features/event";

export default async function AdminEventsPage() {
   const events = await getAllEvents();
   const res = events.data || [];

   return (
      <div className="flex w-full flex-col gap-4">
         <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Heading Section - Event */}
            <div className="relative flex items-end">
               <h1 className="absolute -bottom-2 -left-1.5 z-[-1] bg-gradient-to-t from-transparent via-zinc-100 to-zinc-300 bg-clip-text text-[3rem] font-semibold text-transparent md:text-[5rem]">
                  Event
               </h1>
               <h1 className="relative text-[1.5rem] font-semibold md:text-[3rem]">Event</h1>
            </div>

            {/* Create Event Button */}
            <EventFormModalButton mode="create" />
         </div>

         <AdminEventsTable events={res} />
      </div>
   );
}
