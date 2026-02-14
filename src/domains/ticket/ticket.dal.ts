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
