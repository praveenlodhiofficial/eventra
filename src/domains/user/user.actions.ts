"use server";

import { z } from "zod";

import { getUserById, updateUser } from "@/domains/user/user.dal";
import { UserUpdateInput, UserUpdateSchema } from "@/domains/user/user.schema";

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

/* -------------------------------------------------------------------------- */
/*                          UPDATE USER                                       */
/* -------------------------------------------------------------------------- */

export const updateUserAction = async (id: string, input: UserUpdateInput) => {
  try {
    const parsed = UserUpdateSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Invalid user data",
        errors: z.treeifyError(parsed.error),
      };
    }

    const user = await updateUser(id, parsed.data);

    return {
      success: true,
      status: 200,
      message: "Profile updated successfully",
      data: user,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};
