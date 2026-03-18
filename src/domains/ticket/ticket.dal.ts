import prisma from "@/lib/prisma";

import { TicketInput } from "./ticket.schema";

/* -------------------------------------------------------------------------- */
/*                               Create Ticket                                */
/* -------------------------------------------------------------------------- */

export const createTicket = async (data: TicketInput) => {
  return prisma.ticket.create({
    data: {
      userId: data.userId,
      ticketTypeId: data.ticketTypeId,
      seatNumber: data.seatNumber,
      section: data.section,
      row: data.row,
      quantity: data.quantity,
      status: data.status,
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                         Tickets sold for an event                           */
/* -------------------------------------------------------------------------- */

export const getTicketsSoldForEvent = async (eventId: string) => {
  const res = await prisma.ticket.aggregate({
    where: {
      status: { in: ["PAID", "SCANNED"] },
      ticketType: {
        eventId,
      },
    },
    _sum: { quantity: true },
  });

  return res._sum.quantity ?? 0;
};
