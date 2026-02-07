import prisma from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                              GET USER BY ID                                */
/* -------------------------------------------------------------------------- */

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    },
  });
}
