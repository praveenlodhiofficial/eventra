import prisma from "@/lib/prisma";

/* -------------------------------------------------------------------------- */
/*                             FIND USER BY EMAIL                             */
/* -------------------------------------------------------------------------- */

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: { email },
  });
}

/* -------------------------------------------------------------------------- */
/*                              CREATE USER                                   */
/* -------------------------------------------------------------------------- */

export async function createUser(data: {
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}) {
  return prisma.user.create({
    data,
  });
}
