import { formatDate } from "date-fns";

import { findEvent } from "@/domains/event/event.dal";
import { findTicketTypes } from "@/domains/ticket-type/ticket-type.dal";

import { BuyPageClient } from "./BuyPageClient";

export default async function BuyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const event = await findEvent({ slug });
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">Event not found</h1>
      </div>
    );
  }

  const ticketTypes = await findTicketTypes(event.id);
  if (!ticketTypes || ticketTypes.length === 0) {
    return (
      <div className="relative flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <div className="bg-muted-foreground/10 absolute top-0 left-0 flex w-full flex-col gap-1 p-5 text-center">
          <h1 className="line-clamp-2 text-lg font-semibold md:text-xl lg:text-2xl">
            {event.name}
          </h1>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-light md:text-sm">
              {formatDate(event.startAt, "MMM dd, yyyy")} |{" "}
              {formatDate(event.startAt, "EEEE")} |{" "}
              {formatDate(event.startAt, "p")} - {formatDate(event.endAt, "p")}
            </span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold md:text-3xl">
          No tickets available for this event
        </h1>
      </div>
    );
  }

  const ticketTypesForSelection = ticketTypes.map((t) => ({
    id: t.id,
    name: t.name,
    price: Number(t.price),
    quantity: t.quantity,
  }));

  return (
    <BuyPageClient
      ticketTypes={ticketTypesForSelection}
      eventName={event.name}
      startAt={event.startAt.toISOString()}
      endAt={event.endAt.toISOString()}
    />
  );
}
