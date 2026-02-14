import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                            Create Booking                                 */
/* -------------------------------------------------------------------------- */

export const createBooking = async (
  tx: Prisma.TransactionClient,
  data: {
    userId: string;
    eventId: string;
    expiresAt: Date;
  }
) => {
  return tx.booking.create({
    data: {
      userId: data.userId,
      eventId: data.eventId,
      status: "PENDING",
      expiresAt: data.expiresAt,
      totalAmount: new Prisma.Decimal(0),
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           Update Booking Total                             */
/* -------------------------------------------------------------------------- */
export const updateBookingTotal = async (
  tx: Prisma.TransactionClient,
  bookingId: string,
  total: number
) => {
  return tx.booking.update({
    where: { id: bookingId },
    data: {
      totalAmount: new Prisma.Decimal(total),
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                           find booking by id                             */
/* -------------------------------------------------------------------------- */
export const findBookingById = async (bookingId: string) => {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      userId: true,
      eventId: true,
      totalAmount: true,
      status: true,
      expiresAt: true,
      items: {
        select: {
          id: true,
          ticketTypeId: true,
          quantity: true,
          price: true,
        },
      },
    },
  });
};
