import prisma from "@/lib/prisma";

import { TicketTypeInput } from "./ticket-type.schema";

/* -------------------------------------------------------------------------- */
/*                          Create Ticket Type                                */
/* -------------------------------------------------------------------------- */

export async function createTicketType(data: TicketTypeInput) {
  return prisma.ticketType.create({
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
      eventId: data.eventId,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                          Update Ticket Type                                */
/* -------------------------------------------------------------------------- */

export async function updateTicketType(id: string, data: TicketTypeInput) {
  return prisma.ticketType.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
      quantity: data.quantity,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                           List Ticket Types                                */
/* -------------------------------------------------------------------------- */

export async function findTicketTypes(eventId: string) {
  return prisma.ticketType.findMany({
    where: { eventId },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      price: true,
      quantity: true,
    },
  });
}
