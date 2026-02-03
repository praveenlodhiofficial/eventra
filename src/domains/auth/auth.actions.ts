"use server";

import argon2 from "argon2";
import { z } from "zod";

import { Role } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

import {
  SignInInput,
  SignInSchema,
  SignUpInput,
  SignUpSchema,
} from "./auth.schema";
import { createSession } from "./auth.session";

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

    const existingUser = await prisma.user.findFirst({
      where: {
        email: parsed.data.email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User already exists",
      };
    }

    const hashedPassword = await argon2.hash(parsed.data.password, {
      memoryCost: 192 * 1024,
      timeCost: 5,
      parallelism: 1,
      type: 2,
    });

    const user = await prisma.user.create({
      data: {
        email: parsed.data.email,
        password: hashedPassword,
        role: Role.USER,
      },
      select: {
        email: true,
        role: true,
      },
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

    const user = await prisma.user.findFirst({
      where: {
        email: parsed.data.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
        password: true,
      },
    });

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
