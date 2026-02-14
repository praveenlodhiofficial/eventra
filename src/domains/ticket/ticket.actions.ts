"use server";

import { z } from "zod";

import { createTicket } from "./ticket.dal";
import { TicketInput, TicketSchema } from "./ticket.schema";

/* -------------------------------------------------------------------------- */
/*                            Create Ticket Action                            */
/* -------------------------------------------------------------------------- */

export const createTicketAction = async (input: TicketInput) => {
  try {
    const parsed = TicketSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid ticket data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const ticket = await createTicket(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Ticket created successfully",
      data: ticket,
    };
  } catch (error) {
    console.error(error);
    return { success: false, status: 500, message: "Internal server error" };
  }
};
