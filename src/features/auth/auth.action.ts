import { Roles, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export const signUpWithCredentials = async (
   params: Pick<User, "email" | "password" | "name">
): Promise<{ success: boolean; error?: string; data?: User }> => {
   const { name, email, password } = params;

   try {
      const doesUserExist = await prisma.user.findUnique({
         where: {
            email: email,
         },
      });

      if (doesUserExist) return { success: false, error: "User already exists with this email" };

      const hashedPassword = await hash(password, 10);

      const user = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role: Roles.ATTENDEE,
         },
      });

      return { success: true, data: user };
   } catch (error) {
      console.error("Sign up with credentials failed", error);

      return { success: false, error: "Sign up with credentials failed" };
   }
};

export const signInWithCredentials = async (
   params: Pick<User, "email" | "password">
): Promise<{ success: boolean; error?: string; data?: User }> => {
   const { email, password } = params;

   try {
      const user = await prisma.user.findUnique({
         where: {
            email: email,
         },
      });

      if (!user) return { success: false, error: "No user associated with this email in database" };

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) return { success: false, error: "Invalid password" };

      return { success: true, data: user };
   } catch (error) {
      console.error("Sign in with credentials failed", error);

      return { success: false, error: "Sign in with credentials failed" };
   }
};
