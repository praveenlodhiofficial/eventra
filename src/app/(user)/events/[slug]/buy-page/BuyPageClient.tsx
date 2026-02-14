"use client";

import { TicketCounter } from "@/components/Counter";

import { FooterTotal } from "./FooterTotal";
import {
  TicketSelectionProvider,
  type TicketTypeForSelection,
  useTicketSelection,
} from "./TicketSelectionContext";

type TicketListProps = {
  eventName: string;
  startAt: string;
  endAt: string;
  eventId: string;
  userId: string;
};

function TicketList({
  eventName,
  startAt,
  endAt,
  eventId,
  userId,
}: TicketListProps) {
  const { ticketTypes, selections, setQuantity } = useTicketSelection();
  const start = new Date(startAt);
  const end = new Date(endAt);

  return (
    <>
      <div className="bg-muted-foreground/10 sticky top-0 left-0 z-50 flex w-full flex-col gap-1 p-5 text-center backdrop-blur-md">
        <h1 className="line-clamp-2 text-lg font-semibold md:text-xl lg:text-2xl">
          {eventName}
        </h1>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-light md:text-sm">
            {start.toLocaleDateString("en-IN", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}{" "}
            | {start.toLocaleDateString("en-IN", { weekday: "long" })} |{" "}
            {start.toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {end.toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="mb-25 w-full space-y-5 overflow-y-auto p-3 md:max-w-2xl">
        {ticketTypes.map((ticket) => (
          <div
            key={ticket.id}
            className="border-muted-foreground/20 flex flex-col gap-2 rounded-lg border p-5 md:rounded-xl lg:rounded-2xl"
          >
            <p className="flex gap-2 text-sm font-medium md:gap-3">
              <span>Phase 01</span> | <span>{ticket.name}</span>
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold md:text-2xl">
                ₹{ticket.price}
              </span>
              <TicketCounter
                size="lg"
                variant="outline"
                max={ticket.quantity}
                value={selections[ticket.id] ?? 0}
                onChange={(value) => setQuantity(ticket.id, value)}
              />
            </div>
          </div>
        ))}
      </div>

      <FooterTotal eventId={eventId} userId={userId} />
    </>
  );
}

type BuyPageClientProps = {
  ticketTypes: TicketTypeForSelection[];
  eventName: string;
  startAt: string;
  endAt: string;
  eventId: string;
  userId: string;
};

export function BuyPageClient({
  ticketTypes,
  eventName,
  startAt,
  endAt,
  eventId,
  userId,
}: BuyPageClientProps) {
  return (
    <TicketSelectionProvider ticketTypes={ticketTypes}>
      <div className="relative flex h-full flex-col items-center justify-start gap-3 md:gap-5">
        <TicketList
          eventName={eventName}
          startAt={startAt}
          endAt={endAt}
          eventId={eventId}
          userId={userId}
        />
      </div>
    </TicketSelectionProvider>
  );
}
