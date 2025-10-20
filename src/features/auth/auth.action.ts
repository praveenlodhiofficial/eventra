import { Roles, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";

export const signUpWithCredentials = async (params: Pick<User, "email" | "password" | "name">) => {
   const { name, email, password } = params;

   try {
      const doesUserExist = await prisma.user.findUnique({
         where: {
            email: email,
         },
      });

      if (doesUserExist) {
         return {
            success: false,
            message: "User already exists with this email",
         };
      }

      const hashedPassword = await hash(password, 10);

      const user = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            role: Roles.ATTENDEE,
         },
      });

      return {
         success: true,
         message: "User created successfully",
         data: user,
      };
   } catch (error) {
      console.error("Sign up with credentials failed", error);

      return {
         success: false,
         message: "Sign up with credentials failed",
      };
   }
};

export const signInWithCredentials = async (params: Pick<User, "email" | "password">) => {
   const { email, password } = params;

   try {
      const user = await prisma.user.findUnique({
         where: {
            email: email,
         },
      });

      if (!user) {
         return {
            success: false,
            message: "No user associated with this email in database",
         };
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
         return {
            success: false,
            message: "Invalid password",
         };
      }

      return {
         success: true,
         message: "User signed in successfully",
         data: user,
      };
   } catch (error) {
      console.error("Sign in with credentials failed", error);

      return {
         success: false,
         message: "Sign in with credentials failed",
      };
   }
};
