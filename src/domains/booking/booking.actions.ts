"use server";

import { addMinutes } from "date-fns";

import prisma from "@/lib/prisma";

import { getSession } from "../auth/auth.actions";
import { createBookingItem } from "../booking-item/booking-items.dal";
import { getUserById } from "../user/user.dal";
import {
  createBooking,
  findBookingById,
  updateBookingTotal,
} from "./booking.dal";
import { CreateBookingInput } from "./booking.types";

/* -------------------------------------------------------------------------- */
/*                            Create Booking Action                           */
/* -------------------------------------------------------------------------- */

export async function createBookingAction({
  userId,
  eventId,
  items,
}: CreateBookingInput) {
  if (!items.length) {
    return {
      success: false,
      message: "No tickets selected",
    };
  }

  try {
    const bookingId = await prisma.$transaction(async (tx) => {
      // create booking
      const booking = await createBooking(tx, {
        userId,
        eventId,
        expiresAt: addMinutes(new Date(), 10),
      });

      let total = 0;

      for (const item of items) {
        // fetch real ticket price
        const ticketType = await tx.ticketType.findUnique({
          where: { id: item.ticketTypeId },
        });

        if (!ticketType) throw new Error("Ticket type not found");

        const price = Number(ticketType.price);
        total += price * item.quantity;

        await createBookingItem(tx, {
          bookingId: booking.id,
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
          price,
        });
      }

      await updateBookingTotal(tx, booking.id, total);

      return booking.id;
    });

    return {
      success: true,
      bookingId,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to create booking",
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                      Get Booking By Checkout Id Action                     */
/* -------------------------------------------------------------------------- */

export async function getBookingForCheckout(bookingId: string) {
  try {
    // ================================ SESSION CHECK ================================
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    // ================================ USER CHECK ================================
    const userId = session.userId;

    const user = await getUserById(userId);

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const booking = await findBookingById(bookingId);

    if (!booking) {
      return {
        success: false,
        message: "Booking not found",
      };
    }

    if (booking.userId !== user.id) {
      return {
        success: false,
        message: "This booking is not yours",
      };
    }

    // expired?
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      return {
        success: false,
        message: "Booking expired",
      };
    }

    return {
      success: true,
      data: booking,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to load booking",
    };
  }
}
