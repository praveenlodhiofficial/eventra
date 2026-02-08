import { DataTable } from "@/components/admin/DataTable";
import { CreateEventModal } from "@/components/modals/events/create-event-modal";
import { listEventsAction } from "@/domains/event/event.actions";

import { columns } from "./event-columns";

export default async function EventsPage() {
  const res = await listEventsAction();

  if (!res.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching events data
      </div>
    );
  }

  const events = res.data;

  if (!events || events.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No events found</p>
        <CreateEventModal />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <DataTable
        columns={columns}
        data={events.map((event) => ({
          ...event,
          venueId: event.venue,
          price: event.price.toNumber(),
        }))}
      />
    </div>
  );
}
