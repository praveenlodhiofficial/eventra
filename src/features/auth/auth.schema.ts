import { z } from "zod";

import { UserSchema } from "../user/user.schema";

export const SignUpSchema = UserSchema.pick({
  email: true,
  password: true,
  role: true,
})
  .extend({
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required")
      .describe("The confirm password of the user")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.input<typeof SignUpSchema>;
export type SignUp = z.output<typeof SignUpSchema>;
