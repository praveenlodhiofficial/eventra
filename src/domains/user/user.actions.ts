import { getUserById } from "@/domains/user/user.dal";

/* -------------------------------------------------------------------------- */
/*                          CHECK ADMIN                                       */
/* -------------------------------------------------------------------------- */
export async function assertAdmin(userId: string) {
  const user = await getUserById(userId);

  if (!user || user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }

  return user;
}
