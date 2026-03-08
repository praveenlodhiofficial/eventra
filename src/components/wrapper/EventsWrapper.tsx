import { EventCard } from "@/components/EventCard";
import { findEvents } from "@/domains/event/event.dal";

type Props = {
  performerId?: string;
  categoryId?: string;
  city?: string;
  id?: string;
  slug?: string;
  status?: "PUBLISHED" | "DRAFT";
  title?: string;
  take?: number;
};

export async function EventsWrapper({
  performerId,
  categoryId,
  city,
  id,
  slug,
  status = "PUBLISHED",
  take = 4,
  title,
}: Props) {
  const events = await findEvents({
    performerId,
    categoryId,
    city,
    id,
    slug,
    status,
    take,
  });

  if (!events.length) return null;

  return (
    <section className="space-y-5">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}

      <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
        {events.slice(0, take).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
