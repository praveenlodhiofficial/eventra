import { EventCard } from "@/components/EventCard";
import { findEvents } from "@/domains/event/event.dal";

type Props = {
  performerId?: string;
  categoryId?: string;
  categoryIds?: string[];
  city?: string;
  id?: string;
  slug?: string;
  status?: "PUBLISHED" | "DRAFT";
  title?: string;
  take?: number;
  sort?: "date" | "name" | "price-low" | "price-high" | "distance";
  near?: { lat: number; lng: number } | null;
};

export async function EventsWrapper({
  performerId,
  categoryId,
  categoryIds,
  city,
  id,
  slug,
  status = "PUBLISHED",
  take = 4,
  sort,
  near,
  title,
}: Props) {
  const events = await findEvents({
    performerId,
    categoryId,
    categoryIds,
    city,
    id,
    slug,
    status,
    take,
    sort,
    near,
  });

  if (!events.length) return null;

  return (
    <section className="space-y-5">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {events.slice(0, take).map((event) => (
          <EventCard
            key={event.id}
            event={{
              id: event.id,
              name: event.name,
              slug: event.slug,
              coverImage: event.coverImage,
              startAt: event.startAt,
              endAt: event.endAt,
              venue: event.venue,
              ticketTypes: event.ticketTypes.map((ticketType) => ({
                price: ticketType.price.toString(),
              })),
            }}
          />
        ))}
      </div>
    </section>
  );
}
