import Link from "next/link";

import { DataTable } from "@/components/admin/DataTable";
import { eventColumns } from "@/components/data-table/event-columns";
import { ActionButton2 } from "@/components/ui/action-button";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { listEventsAction } from "@/domains/event/event.actions";
import { listVenuesAction } from "@/domains/venue/venue.actions";

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
        <Link href="/admin/events/create">
          <ActionButton2
            variant="outline"
            className="flex w-fit cursor-pointer items-center gap-2"
          >
            Create Event
          </ActionButton2>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <DataTable
        columns={eventColumns}
        data={events.map((event) => ({
          name: event.name,
          status: event.status,
          id: event.id,
          slug: event.slug,
          city: event.city ?? undefined,
          startAt: event.startAt ?? undefined,
          endAt: event.endAt ?? undefined,
          venueId: event.venue ? event.venue.name : undefined,
        }))}
        toolbarAction={
          <Link href="/admin/events/create">
            <ActionButton2
              variant="outline"
              className="flex w-fit cursor-pointer items-center gap-2"
            >
              Create Event
            </ActionButton2>
          </Link>
        }
      />
    </div>
  );
}
