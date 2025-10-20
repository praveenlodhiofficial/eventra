import { userSchema } from "@/features/user";
import { z } from "zod";

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
export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
