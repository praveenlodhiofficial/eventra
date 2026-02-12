import prisma from "@/lib/prisma";

import { TicketTypeInput } from "./ticket-type.schema";

/* -------------------------------------------------------------------------- */
/*                          Create Ticket Type                                */
/* -------------------------------------------------------------------------- */

export async function createTicketType(data: TicketTypeInput) {
  return prisma.ticketType.create({
    data: {
      name: data.name,
      price: data.price, // Prisma handles Decimal conversion
      quantity: data.quantity,
      eventId: data.eventId,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                           List Ticket Types                                */
/* -------------------------------------------------------------------------- */

export async function listTicketTypes(eventId: string) {
  return prisma.ticketType.findMany({
    where: { eventId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      // id: true,
      name: true,
      price: true,
      quantity: true,
    },
  });
}
