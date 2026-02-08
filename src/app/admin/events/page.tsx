import { DataTable } from "@/components/admin/DataTable";
import { CreateEventModal } from "@/components/modals/events/create-event-modal";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { listEventsAction } from "@/domains/event/event.actions";

import { columns } from "./event-columns";

export default async function EventsPage() {
  const res = await listEventsAction();
  const categoriesRes = await listEventCategoriesAction();

  if (!res.success || !categoriesRes.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching events or categories data
      </div>
    );
  }

  const events = res.data;
  const categories = categoriesRes.data;

  if (
    !events ||
    events.length === 0 ||
    !categories ||
    categories.length === 0
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
          venueId: event.venue,
          price: event.price.toNumber(),
        }))}
        toolbarAction={<CreateEventModal categories={categories ?? []} />}
      />
    </div>
  );
}
