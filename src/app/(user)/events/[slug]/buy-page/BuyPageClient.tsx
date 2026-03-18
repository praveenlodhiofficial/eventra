"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { TicketCounter } from "@/components/Counter";
import { ActionButton2 } from "@/components/ui/action-button";
import { createBookingAction } from "@/domains/booking/booking.actions";

export type TicketTypeForSelection = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Selections = Record<string, number>;

type TicketSelectionContextValue = {
  ticketTypes: TicketTypeForSelection[];
  selections: Selections;
  setQuantity: (ticketTypeId: string, quantity: number) => void;
};

const TicketSelectionContext =
  React.createContext<TicketSelectionContextValue | null>(null);

function TicketSelectionProvider({
  ticketTypes,
  children,
}: {
  ticketTypes: TicketTypeForSelection[];
  children: React.ReactNode;
}) {
  const [selections, setSelections] = React.useState<Selections>({});

  const setQuantity = React.useCallback(
    (ticketTypeId: string, quantity: number) => {
      setSelections((prev) => {
        if (quantity <= 0) {
          const next = { ...prev };
          delete next[ticketTypeId];
          return next;
        }
        return { ...prev, [ticketTypeId]: quantity };
      });
    },
    []
  );

  const value = React.useMemo(
    () => ({ ticketTypes, selections, setQuantity }),
    [ticketTypes, selections, setQuantity]
  );

  return (
    <TicketSelectionContext.Provider value={value}>
      {children}
    </TicketSelectionContext.Provider>
  );
}

function useTicketSelection() {
  const ctx = React.useContext(TicketSelectionContext);
  if (!ctx) {
    throw new Error(
      "useTicketSelection must be used within TicketSelectionProvider"
    );
  }
  return ctx;
}

function FooterTotal({ eventId, userId }: { eventId: string; userId: string }) {
  const router = useRouter();
  const { ticketTypes, selections } = useTicketSelection();

  const [loading, setLoading] = React.useState(false);

  const totalRupees = ticketTypes.reduce(
    (sum, t) => sum + (selections[t.id] ?? 0) * t.price,
    0
  );

  const totalTickets = ticketTypes.reduce(
    (sum, t) => sum + (selections[t.id] ?? 0),
    0
  );

  async function handleBooking() {
    if (totalTickets === 0) return;

    try {
      setLoading(true);

      const items = Object.entries(selections).map(
        ([ticketTypeId, quantity]) => ({
          ticketTypeId,
          quantity,
        })
      );

      const result = await createBookingAction({
        userId,
        eventId,
        items,
      });

      if (!result.success) {
        alert(result.message ?? "Failed to create booking");
        return;
      }

      router.push(`/events/buy/checkout/${result.bookingId}`);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-muted-foreground/10 fixed bottom-0 left-0 z-50 flex w-full flex-col gap-1 p-5 text-center backdrop-blur-md">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-2xl md:px-5">
        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold md:text-2xl">
            ₹{totalRupees.toFixed(2)}
          </p>
          <p className="text-sm font-light md:text-base">
            {totalTickets} Ticket{totalTickets !== 1 ? "s" : ""}
          </p>
        </div>

        <ActionButton2
          disabled={totalTickets === 0 || loading}
          onClick={handleBooking}
          className="flex items-center justify-center py-6.5 md:py-7"
        >
          {loading ? "Processing..." : "Book Tickets"}
        </ActionButton2>
      </div>
    </div>
  );
}

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

      <div className="w-full space-y-5 overflow-y-auto p-3 md:max-w-2xl">
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
      <div className="relative flex flex-col items-center justify-start gap-3 md:gap-5">
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
