import { DataTable } from "@/components/admin/DataTable";
import { listEventsAction } from "@/domains/event/event.actions";

import { columns } from "./event-columns";

export default async function EventsPage() {
  const res = await listEventsAction();

  if (!res.success) {
    return <div>Error fetching events data</div>;
  }

  const events = res.data;

  if (!events || events.length === 0) {
    return <div>No events found</div>;
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
