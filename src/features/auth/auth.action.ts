"use server";

import { createUserSession } from "@/features/auth/auth.session";
import { comparePasswords, generateSalt, hashPassword } from "@/features/auth/auth.passwordHasher";
import { Roles, User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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

      const salt = generateSalt();
      const hashedPassword = await hashPassword(password, salt);

      const user = await prisma.user.create({
         data: {
            name,
            email,
            password: hashedPassword,
            salt,
            role: Roles.ATTENDEE,
         },
      });

      // Create session after successful signup
      try {
         const cookieStore = await cookies();
         await createUserSession(
            {
               id: user.id,
               role: user.role,
            },
            cookieStore
         );
         console.log("Session created successfully for user:", user.id);
      } catch (sessionError) {
         console.error("Failed to create session:", sessionError);
         // Don't fail the signup if session creation fails
         // The user is still created in the database
      }

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

      const isPasswordValid = await comparePasswords({
         password,
         salt: user.salt,
         hashedPassword: user.password,
      });

      if (!isPasswordValid) return { success: false, error: "Invalid password" };

      // Create session after successful signin
      try {
         const cookieStore = await cookies();
         await createUserSession(
            {
               id: user.id,
               role: user.role,
            },
            cookieStore
         );
         console.log("Session created successfully for user:", user.id);
      } catch (sessionError) {
         console.error("Failed to create session:", sessionError);
         // Don't fail the signin if session creation fails
         // The user credentials are still valid
      }

      return { success: true, data: user };
   } catch (error) {
      console.error("Sign in with credentials failed", error);

      return { success: false, error: "Sign in with credentials failed" };
   }
};
