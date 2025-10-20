import { Roles } from "@/generated/prisma";
import { z } from "zod";

export const userSchema = z.object({
   id: z.string().optional(),
   name: z.string().min(1, { message: "Name is required" }),
   email: z.email({ message: "Invalid email address" }),
   password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
         message:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      })
      .min(6, { message: "Password must be at least 6 characters long" })
      .optional(),
   phone: z.string().min(1, { message: "Phone number is required" }),
   address: z.string().min(1, { message: "Address is required" }),
   city: z.string().min(1, { message: "City is required" }),
   state: z.string().min(1, { message: "State is required" }),
   country: z.string().min(1, { message: "Country is required" }),
   pinCode: z.string().min(1, { message: "Pin code is required" }),
   imageUrl: z.url().or(z.literal("")).optional(),
   role: z.enum(Roles),
});

export type UserSchema = z.infer<typeof userSchema>;
