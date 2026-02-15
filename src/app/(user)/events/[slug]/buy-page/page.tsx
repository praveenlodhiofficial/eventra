import Link from "next/link";

import { formatDate } from "date-fns";
import { ChevronsRightIcon } from "lucide-react";

import { ActionButton1 } from "@/components/ui/action-button";
import { getSession } from "@/domains/auth/auth.actions";
import { findEvent } from "@/domains/event/event.dal";
import { findTicketTypes } from "@/domains/ticket-type/ticket-type.dal";

import { BuyPageClient } from "./BuyPageClient";

export default async function BuyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  // ================================ SESSION CHECK ================================
  const session = await getSession();
  if (!session) {
    return (
      <div className="bg-muted-foreground/10 absolute top-1/2 left-1/2 flex h-[calc(100vh-15rem)] w-5xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-3xl">
        <h1 className="text-center text-2xl font-medium md:text-3xl">
          Sign in to book tickets
        </h1>
        <Link
          href="/sign-in"
          className="flex w-full items-center justify-center md:max-w-xs"
        >
          <ActionButton1
            icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
            size="lg"
            className="w-full cursor-pointer py-7 text-base"
          >
            Sign In
          </ActionButton1>
        </Link>
      </div>
    );
  }

  const userId = session.userId;

  // ================================ EVENT CHECK ================================
  const event = await findEvent({ slug });
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">Event not found</h1>
      </div>
    );
  }

  // ================================ TICKET TYPES CHECK ================================
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

  // ================================ TICKET TYPES FOR SELECTION ================================
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
      eventId={event.id}
      userId={userId}
    />
  );
}
