"use server";

import { cookies } from "next/headers";

import argon2 from "argon2";
import { z } from "zod";

import { createUser, findUserByEmail } from "@/domains/auth/auth.dal";

import {
  SignInInput,
  SignInSchema,
  SignUpInput,
  SignUpSchema,
} from "./auth.schema";
import { createSession, decrypt } from "./auth.session";

/* -------------------------------------------------------------------------- */
/*                          Sign Up Action                                    */
/* -------------------------------------------------------------------------- */

export const SignUpAction = async (input: SignUpInput) => {
  try {
    const parsed = SignUpSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Validation failed",
        errors: z.treeifyError(parsed.error),
      };
    }

    const existingUser = await findUserByEmail(parsed.data.email);

    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User already exists",
      };
    }

    const hashedPassword = await argon2.hash(parsed.data.password);

    const user = await createUser({
      email: parsed.data.email,
      password: hashedPassword,
      role: "USER",
    });

    return {
      success: true,
      status: 201,
      message: "User signed-up successfully",
      data: {
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("SIGN UP ERROR:", error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                          Sign In Action                                    */
/* -------------------------------------------------------------------------- */

export const SignInAction = async (input: SignInInput) => {
  try {
    const parsed = SignInSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        status: 400,
        message: "Validation failed",
        errors: z.treeifyError(parsed.error),
      };
    }

    const user = await findUserByEmail(parsed.data.email);

    if (!user) {
      return {
        success: false,
        status: 401,
        message: "Invalid credentials",
      };
    }

    const isPasswordValid = await argon2.verify(
      user.password,
      parsed.data.password
    );

    if (!isPasswordValid) {
      return {
        success: false,
        status: 401,
        message: "Invalid credentials",
      };
    }

    await createSession(user.id, user.role);

    return {
      success: true,
      status: 200,
      message: "User signed-in successfully",
      data: {
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.log("SIGN IN ERROR", error);
    return {
      success: false,
      status: 500,
      message: "Internal server error",
    };
  }
};

/* -------------------------------------------------------------------------- */
/*                             GET SESSION                                    */
/* -------------------------------------------------------------------------- */

export async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  return await decrypt(cookie);
}

/* -------------------------------------------------------------------------- */
/*                         REQUIRE SIGN IN                                    */
/* -------------------------------------------------------------------------- */

export async function requireAuth() {
  const session = await getSession();

  if (!session?.userId) {
    throw new Error("AUTH_REQUIRED");
  }

  return session;
}

/* -------------------------------------------------------------------------- */
/*                         REQUIRE ADMIN                                      */
/* -------------------------------------------------------------------------- */

export async function requireAdmin() {
  const session = await requireAuth();

  if (session.role !== "ADMIN") {
    throw new Error("ADMIN_REQUIRED");
  }

  return session;
}
