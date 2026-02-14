"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ActionButton2 } from "@/components/ui/action-button";
import { createBookingAction } from "@/domains/booking/booking.actions";

import { useTicketSelection } from "./TicketSelectionContext";

type FooterTotalProps = {
  eventId: string;
  userId: string;
};

export function FooterTotal({ eventId, userId }: FooterTotalProps) {
  const router = useRouter();
  const { ticketTypes, selections } = useTicketSelection();

  const [loading, setLoading] = React.useState(false);

  // total money (UI only)
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

      router.push(`/events/buy/checkout/${result.bookingId}/summary`);
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
        {/* Left side */}
        <div className="flex flex-col items-start">
          <p className="text-xl font-semibold md:text-2xl">
            ₹{totalRupees.toFixed(2)}
          </p>
          <p className="text-sm font-light md:text-base">
            {totalTickets} Ticket{totalTickets !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Right side */}
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
