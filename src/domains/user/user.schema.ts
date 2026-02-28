import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*                          User Schema                                      */
/* -------------------------------------------------------------------------- */

export const UserSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).max(50).trim().optional(),
  email: z.email().min(5).max(50).trim(),

  password: z
    .string()
    .min(8, "Minimum 8 characters are required")
    .max(100, "Maximum 100 characters are allowed")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .describe("The password of the user")
    .trim(),

  avatar: z.url().optional(),

  phoneNumber: z.string().min(1).max(20).trim().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

export type UserInput = z.input<typeof UserSchema>;
export type User = z.output<typeof UserSchema>;

/* -------------------------------------------------------------------------- */
/*                          User Update Schema                                */
/* -------------------------------------------------------------------------- */

export const UserUpdateSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1).max(50).trim().or(z.literal("")).optional(),
  email: z.email().min(5).max(50).trim(),
  avatar: z.union([z.string().url(), z.literal("")]).optional(),
  phoneNumber: z.string().min(1).max(20).trim().or(z.literal("")).optional(),
});

export type UserUpdateInput = z.input<typeof UserUpdateSchema>;
export type UserUpdate = z.output<typeof UserUpdateSchema>;
