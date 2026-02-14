"use client";

import { ActionButton2 } from "@/components/ui/action-button";

import { useTicketSelection } from "./TicketSelectionContext";

export function FooterTotal() {
  const { ticketTypes, selections } = useTicketSelection();

  const totalRupees = ticketTypes.reduce(
    (sum, t) => sum + (selections[t.id] ?? 0) * t.price,
    0
  );
  const totalTickets = ticketTypes.reduce(
    (sum, t) => sum + (selections[t.id] ?? 0),
    0
  );

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

        <ActionButton2 className="flex cursor-pointer items-center justify-center py-6.5 text-center md:py-7">
          <span className="text-base font-medium">Book Tickets</span>
        </ActionButton2>
      </div>
    </div>
  );
}
