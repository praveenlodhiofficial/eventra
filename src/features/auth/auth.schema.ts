import { z } from "zod";

import { UserSchema } from "../user/user.schema";

export const SignUpSchema = UserSchema.pick({
  email: true,
  password: true,
  role: true,
});

export type SignUpInput = z.input<typeof SignUpSchema>;
export type SignUp = z.output<typeof SignUpSchema>;

export const SignInSchema = UserSchema.pick({
  email: true,
  password: true,
});

export type SignInInput = z.input<typeof SignInSchema>;
export type SignIn = z.output<typeof SignInSchema>;
