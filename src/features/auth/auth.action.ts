"use server";

import { comparePasswords, generateSalt, hashPassword } from "@/features/auth/auth.passwordHasher";
import { createUserSession } from "@/features/auth/auth.session";
import { sendOnboardingEmail } from "@/features/email/email.action";
import { Roles, User } from "@/generated/prisma";
import config from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

// ========================================= SIGN UP WITH CREDENTIALS =========================================

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

      /*
       * No session on signup: session is created on sign-in only.
       * Fire onboarding email on successful signup (non-blocking).
       */

      (async () => {
         try {
            const ctaUrl = `${config.env.siteUrl}/events`;
            await sendOnboardingEmail({ to: user.email, name: user.name, ctaUrl });
         } catch {}
      })();

      return { success: true, data: user };
   } catch (error) {
      console.error("Sign up with credentials failed", error);

      return { success: false, error: "Sign up with credentials failed" };
   }
};

// ========================================= SIGN IN WITH CREDENTIALS =========================================

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
      }

      /*
       * No session on signup: session is created on sign-in only.
       * Fire onboarding email on successful signup (non-blocking).
       */

      (async () => {
         try {
            const ctaUrl = `${config.env.siteUrl}/events`;
            await sendOnboardingEmail({ to: user.email, name: user.name, ctaUrl });
         } catch {}
      })();

      return { success: true, data: user };
   } catch (error) {
      console.error("Sign in with credentials failed", error);

      return { success: false, error: "Sign in with credentials failed" };
   }
};
