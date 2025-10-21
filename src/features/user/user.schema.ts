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
   salt: z.string().min(10, { message: "Salt is required" }).optional(),
   phone: z.string().optional(),
   address: z.string().min(10, { message: "Address is required" }).optional(),
   city: z.string().min(3, { message: "City is required" }).optional(),
   state: z.string().min(3, { message: "State is required" }).optional(),
   country: z.string().min(3, { message: "Country is required" }).optional(),
   pinCode: z.string().optional(),
   imageUrl: z.string().optional(),
   role: z.enum(Roles),
});

export type UserSchema = z.infer<typeof userSchema>;
