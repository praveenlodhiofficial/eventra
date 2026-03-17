import EditEventPageClient from "@/components/events/EditEventPageClient";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { getEventAction } from "@/domains/event/event.actions";
import { listTicketTypesAction } from "@/domains/ticket-type/ticket-type.actions";

type PageProps = {
  params: { slug: string };
};

export default async function AdminEditEventPage({ params }: PageProps) {
  const { slug } = await params;

  const eventRes = await getEventAction({ slug });
  const categoriesRes = await listEventCategoriesAction();

  if (!eventRes.success || !eventRes.data) {
    throw new Error("Failed to load event");
  }

  if (!categoriesRes.success || !categoriesRes.data) {
    throw new Error("Failed to load categories");
  }

  const event = eventRes.data;

  const ticketTypesRes = await listTicketTypesAction(event.id);

  const initialEvent = {
    id: event.id,
    slug: event.slug,
    name: event.name,
    description: event.description,
    coverImage: event.coverImage ?? "",
    images: event.images?.map((img) => img.url) ?? [],
    status: event.status,
    city: event.city ?? "",
    cityToBeAnnounced: event.cityToBeAnnounced,
    performerToBeAnnounced: event.performerToBeAnnounced,
    venueToBeAnnounced: event.venueToBeAnnounced,
    scheduleToBeAnnounced: event.scheduleToBeAnnounced,
    categoryIds: event.categories?.map((c) => c.id!) ?? [],
    performerIds: event.performers?.map((p) => p.id!) ?? [],
    venueId: event.venue?.id ?? "",
    startAt: event.startAt ? event.startAt.toISOString() : null,
    endAt: event.endAt ? event.endAt.toISOString() : null,
    performerSummaries:
      event.performers?.map((p) => ({
        id: p.id!,
        name: p.name,
        image: p.image,
        role: p.role,
        slug: p.slug,
      })) ?? [],
    venueSummary: event.venue
      ? {
          id: event.venue.id!,
          name: event.venue.name,
          city: event.venue.city,
        }
      : null,
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-3xl">Edit Event</h1>
      <p className="text-muted-foreground text-sm">
        Update the details below to modify this event.
      </p>

      <EditEventPageClient
        categories={categoriesRes.data ?? []}
        initialEvent={initialEvent}
        existingTickets={
          ticketTypesRes.success && ticketTypesRes.data
            ? ticketTypesRes.data.map((t) => ({
                id: t.id,
                name: t.name,
                price: Number(t.price),
                quantity: t.quantity,
                eventId: event.id,
              }))
            : []
        }
      />
    </div>
  );
}
