import { AdminEventsTable, EventFormModalButton, getAllEvents } from "@/features/event";
import { EventSchema } from "@/features/event/event.schema";

export default async function AdminEventsPage() {
   const events = await getAllEvents();

   // Get the first event as default values (you might want to change this logic)
   let eventData: Partial<EventSchema> | undefined;

   if (events.success && events.data && events.data.length > 0) {
      const firstEvent = events.data[0];
      eventData = {
         id: firstEvent.id,
         name: firstEvent.name,
         description: firstEvent.description,
         startDate: firstEvent.startDate,
         endDate: firstEvent.endDate,
         location: firstEvent.location,
         eventType: firstEvent.eventType,
         ticketType: firstEvent.ticketType,
      };
   }

   const res = events.data || [];

   return (
      <div className="flex flex-col gap-4 w-full">
         <EventFormModalButton defaultValues={eventData} />
         <AdminEventsTable events={res} />
      </div>
   );
}
