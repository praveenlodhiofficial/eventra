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
