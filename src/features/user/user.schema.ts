import { Roles } from "@/generated/prisma";
import { z } from "zod";

// ✅ Base schema for a full User object (mirrors Prisma model)
export const userSchema = z.object({
   id: z.string().uuid({ message: "Invalid user ID" }),
   email: z.string().email({ message: "Invalid email address" }),
   password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
   role: z.nativeEnum(Roles, { message: "Invalid role" }),
   createdAt: z.date({ message: "Invalid date" }),
   updatedAt: z.date({ message: "Invalid date" }),
});

// ✅ Create (Sign Up) schema derived from base
export const signUpSchema = userSchema
   .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
   })
   .extend({
      confirmPassword: z
         .string()
         .min(6, { message: "Confirm password must be at least 6 characters long" }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

// ✅ Sign In schema derived from base
export const signInSchema = userSchema.pick({
   email: true,
   password: true,
});

// ✅ Types
export type UserSchema = z.infer<typeof userSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
