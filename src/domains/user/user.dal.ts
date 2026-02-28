import prisma from "@/lib/prisma";

import { UserUpdate } from "./user.schema";

/* -------------------------------------------------------------------------- */
/*                              GET USER BY ID                                */
/* -------------------------------------------------------------------------- */

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phoneNumber: true,
      role: true,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                          UPDATE USER                                       */
/* -------------------------------------------------------------------------- */

export async function updateUser(id: string, data: UserUpdate) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      phoneNumber: true,
    },
  });
}
