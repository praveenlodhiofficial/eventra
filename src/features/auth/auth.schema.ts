import { z } from "zod";

import { UserSchema } from "../user/user.schema";

/* -------------------------------------------------------------------------- */
/*                          Sign Up Schema                                    */
/* -------------------------------------------------------------------------- */

export const SignUpSchema = UserSchema.pick({
  email: true,
  password: true,
  role: true,
});

export type SignUpInput = z.input<typeof SignUpSchema>;
export type SignUp = z.output<typeof SignUpSchema>;

/* -------------------------------------------------------------------------- */
/*                          Sign In Schema                                    */
/* -------------------------------------------------------------------------- */

export const SignInSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type SignInInput = z.input<typeof SignInSchema>;
export type SignIn = z.output<typeof SignInSchema>;

/* -------------------------------------------------------------------------- */
/*                          Session Payload Schema                            */
/* -------------------------------------------------------------------------- */

export const SessionPayload = z.object({
  userId: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  expiresAt: z.date(),
});

export type SessionPayload = z.output<typeof SessionPayload>;
