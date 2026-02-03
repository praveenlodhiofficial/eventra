import { z } from "zod";

export const UserSchema = z.object({
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

  phoneNumber: z.string().min(1).max(20).trim().optional(),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});
