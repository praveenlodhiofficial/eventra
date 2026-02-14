import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                          Create Booking Item                               */
/* -------------------------------------------------------------------------- */
export const createBookingItem = async (
  tx: Prisma.TransactionClient,
  data: {
    bookingId: string;
    ticketTypeId: string;
    quantity: number;
    price: number;
  }
) => {
  return tx.bookingItem.create({
    data: {
      bookingId: data.bookingId,
      ticketTypeId: data.ticketTypeId,
      quantity: data.quantity,
      price: new Prisma.Decimal(data.price),
    },
  });
};

/* -------------------------------------------------------------------------- */
/*                          Find Booking Items by Booking Id                   */
/* -------------------------------------------------------------------------- */
export const findBookingItems = async (bookingId: string) => {
  return prisma.bookingItem.findMany({
    where: { bookingId },
    select: {
      id: true,
      ticketTypeId: true,
      ticketType: {
        select: {
          name: true,
        },
      },
      quantity: true,
      price: true,
    },
  });
};
