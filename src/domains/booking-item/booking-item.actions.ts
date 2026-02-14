"use server";

import prisma from "@/lib/prisma";

import { BookingItem, BookingItemSchema } from "./booking-item.schema";
import { createBookingItem } from "./booking-items.dal";

/* -------------------------------------------------------------------------- */
/*                          Create Booking Item Action                        */
/* -------------------------------------------------------------------------- */

export async function createBookingItemAction(data: BookingItem) {
  const parsed = BookingItemSchema.safeParse(data);

  if (!parsed.success) return { success: false };

  const { bookingId, ticketTypeId, quantity } = parsed.data;

  // fetch real ticket
  const ticketType = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
  });

  if (!ticketType) {
    return { success: false, message: "Ticket type not found" };
  }

  const bookingItem = await createBookingItem(prisma, {
    bookingId,
    ticketTypeId,
    quantity,
    price: Number(ticketType.price),
  });

  return { success: true, data: bookingItem };
}
