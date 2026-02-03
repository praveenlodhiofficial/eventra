// src/proxy.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/features/auth/auth.session";

// These are the actual URL paths, not the folder names.
// Route groups like (auth) don't appear in the URL.
const publicRoutes = ["/", "/sign-in", "/sign-up"];
const adminRoutes = ["/admin"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  // Everything that isn't public and isn't admin is a user route
  const isUserRoute = !isPublicRoute && !isAdminRoute;

  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null; // ← fixes your JWSInvalid error

  // 1. User is NOT logged in and hitting a protected route → send to sign-in
  if ((isUserRoute || isAdminRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // 2. User IS logged in and hitting sign-in or sign-up → send to dashboard
  if ((path === "/sign-in" || path === "/sign-up") && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 3. User is logged in but NOT admin and hitting an admin route → forbidden
  if (isAdminRoute && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // 4. Everything else passes through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
