"use server";

import { getUserFromSession, removeUserFromSession } from "@/features/auth/auth.session";
import { User as PrismaUser } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { FullUser, User } from "./user.types";

function _getCurrentUser(options: {
   withFullUser: true;
   redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
   withFullUser: true;
   redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
   withFullUser?: false;
   redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
   withFullUser?: false;
   redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({ withFullUser = false, redirectIfNotFound = false } = {}) {
   const user = await getUserFromSession(await cookies());

   if (user == null) {
      if (redirectIfNotFound) return redirect("/sign-in");
      return null;
   }

   if (withFullUser) {
      const fullUser = await getUserFromDb(user.id);
      // Handle inconsistent state where session exists but user not in database
      if (fullUser == null) {
         console.error("Session exists but user not found in database for ID:", user.id);
         // Clear the invalid session and redirect to sign-in
         const cookieStore = await cookies();
         await removeUserFromSession(cookieStore);
         if (redirectIfNotFound) return redirect("/sign-in");
         return null;
      }
      return fullUser;
   }

   return user;
}

export const getCurrentUser = cache(_getCurrentUser);

async function getUserFromDb(id: string): Promise<FullUser | null> {
   const user = await prisma.user.findUnique({
      where: { id },
      select: {
         id: true,
         email: true,
         role: true,
         name: true,
         phone: true,
         address: true,
         city: true,
         state: true,
         country: true,
         pinCode: true,
         imageUrl: true,
      },
   });

   return user;
}

export const updateCurrentUser = async (
   params: Pick<
      PrismaUser,
      | "id"
      | "name"
      | "email"
      | "phone"
      | "address"
      | "city"
      | "state"
      | "country"
      | "pinCode"
      | "imageUrl"
   >
) => {
   const { name, email, phone, address, city, state, country, pinCode, imageUrl } = params;

   try {
      const user = await prisma.user.findUnique({
         where: {
            id: params.id,
         },
      });

      if (!user) {
         return {
            success: false,
            message: "User not associated with this ID",
         };
      }

      const updatedUser = await prisma.user.update({
         where: {
            id: params.id,
         },
         data: {
            name: name ?? user.name,
            email: email ?? user.email,
            phone: phone ?? user.phone,
            address: address ?? user.address,
            city: city ?? user.city,
            state: state ?? user.state,
            country: country ?? user.country,
            pinCode: pinCode ?? user.pinCode,
            imageUrl: imageUrl ?? user.imageUrl,
            updatedAt: new Date(),
         },
      });

      return {
         success: true,
         message: "User updated successfully",
         data: updatedUser,
      };
   } catch (error) {
      console.error("Error updating current user", error);
      return {
         success: false,
         message: error instanceof Error ? error.message : "Failed to update user profile",
      };
   }
};
