"use server";

import { z } from "zod";

import {
  createTicketType,
  findTicketTypes,
  updateTicketType,
} from "./ticket-type.dal";
import { TicketTypeInput, TicketTypeSchema } from "./ticket-type.schema";

/* -------------------------------------------------------------------------- */
/*                           Create Ticket Type Action                        */
/* -------------------------------------------------------------------------- */

export async function createTicketTypeAction(data: TicketTypeInput) {
  const parsed = TicketTypeSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid ticket type data",
      errors: z.treeifyError(parsed.error),
    };
  }

  try {
    const ticketType = await createTicketType(parsed.data);

    return {
      success: true,
      status: 201,
      message: "Ticket type created successfully",
      data: ticketType,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                           Update Ticket Type Action                        */
/* -------------------------------------------------------------------------- */

export async function updateTicketTypeAction(
  id: string,
  data: TicketTypeInput
) {
  const parsed = TicketTypeSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      status: 400,
      message: "Invalid ticket type data",
      errors: z.treeifyError(parsed.error),
    };
  }

  try {
    const ticketType = await updateTicketType(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Ticket type updated successfully",
      data: ticketType,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                           List Ticket Types Action                         */
/* -------------------------------------------------------------------------- */

export async function listTicketTypesAction(eventId: string) {
  try {
    const ticketTypes = await findTicketTypes(eventId);

    if (!ticketTypes) {
      return {
        success: false,
        status: 404,
        message: "Ticket types not found",
      };
    }

    return {
      success: true,
      status: 200,
      message: "Ticket types fetched successfully",
      data: ticketTypes,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
}
