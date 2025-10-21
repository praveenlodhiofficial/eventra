"use server";

import { getUserFromSession } from "@/features/auth/auth.session";
import { User } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const getCurrentUser = async (id: string) => {
   try {
      const user = await prisma.user.findUnique({
         where: {
            id: id,
         },
      });

      return {
         success: true,
         message: "User fetched successfully",
         data: user,
      };
   } catch (error) {
      console.error("Error getting current user", error);
      return {
         success: false,
         message: "Error getting current user",
      };
   }
};

export const getCurrentUserFromSession = async () => {
   try {
      const cookieStore = await cookies();
      const sessionUser = await getUserFromSession(cookieStore);

      if (!sessionUser) {
         return {
            success: false,
            message: "No active session found",
         };
      }

      const user = await prisma.user.findUnique({
         where: {
            id: sessionUser.id,
         },
      });

      if (!user) {
         return {
            success: false,
            message: "User not found",
         };
      }

      return {
         success: true,
         message: "User fetched successfully from session",
         data: user,
      };
   } catch (error) {
      console.error("Error getting current user from session", error);
      return {
         success: false,
         message: "Error getting current user from session",
      };
   }
};

export const updateCurrentUser = async (
   params: Pick<
      User,
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
