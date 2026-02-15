import prisma from "@/lib/prisma";

import { BillingDetailsInput } from "./billing.schema";

export const createBillingDetails = async (data: BillingDetailsInput) => {
  return prisma.billingDetails.upsert({
    where: { bookingId: data.bookingId },
    update: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      nationality: data.nationality,
      state: data.state,
      acceptedTerms: data.acceptedTerms,
    },
    create: {
      booking: {
        connect: { id: data.bookingId },
      },
      name: data.name,
      phone: data.phone,
      email: data.email,
      nationality: data.nationality,
      state: data.state,
      acceptedTerms: data.acceptedTerms,
    },
  });
};
