import { userSchema } from "@/features/user";
import { z } from "zod";

// ✅ Create (Sign Up) schema derived from base
// - Require password for sign-up
// - Do not expose role/id on the sign-up form
export const signUpSchema = userSchema
   .pick({
      name: true,
      email: true,
   })
   .extend({
      password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
      confirmPassword: z
         .string()
         .min(6, { message: "Confirm password must be at least 6 characters long" }),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

// ✅ Sign In schema derived from base (require password)
export const signInSchema = userSchema
   .pick({
      email: true,
   })
   .extend({
      password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
   });

// ✅ Types
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
