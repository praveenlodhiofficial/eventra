import { DataTable } from "@/components/admin/DataTable";
import { CreateEventModal } from "@/components/modals/events/create-event-modal";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { listEventsAction } from "@/domains/event/event.actions";
import { listVenuesAction } from "@/domains/venue/venue.actions";

import { columns } from "./event-columns";

export default async function EventsPage() {
  const res = await listEventsAction();
  const categoriesRes = await listEventCategoriesAction();
  const venuesRes = await listVenuesAction();

  if (!res.success || !categoriesRes.success || !venuesRes.success) {
    throw new Error("Failed to fetch events or categories data");
  }

  const events = res.data;
  const categories = categoriesRes.data;
  const venues = venuesRes.data;
  if (
    !events ||
    events.length === 0 ||
    !categories ||
    categories.length === 0 ||
    !venues ||
    venues.length === 0
  ) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No events or categories found</p>
        <CreateEventModal categories={categories ?? []} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <DataTable
        columns={columns}
        data={events.map((event) => ({
          ...event,
          venue: venues.find((venue) => venue.id === event.venueId)?.name,
          price: event.price.toNumber(),
        }))}
        toolbarAction={<CreateEventModal categories={categories ?? []} />}
      />
    </div>
  );
}
