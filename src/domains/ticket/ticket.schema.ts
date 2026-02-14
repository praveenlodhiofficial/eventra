import { z } from "zod";

import { TICKET_STATUS } from "./ticket.constants";

/* -------------------------------------------------------------------------- */
/*                              Ticket Schema                                 */
/* -------------------------------------------------------------------------- */

export const TicketStatusEnum = z.enum(TICKET_STATUS);

export const TicketSchema = z.object({
  userId: z.string().min(1, "User is required"),
  ticketTypeId: z.string().min(1, "Ticket type is required"),

  seatNumber: z.string().optional(),
  section: z.string().optional(),
  row: z.string().optional(),

  quantity: z.number().min(1, "Quantity must be at least 1"),
  status: TicketStatusEnum.default("RESERVED"),
});

export type TicketInput = z.input<typeof TicketSchema>;
export type Ticket = z.output<typeof TicketSchema>;
