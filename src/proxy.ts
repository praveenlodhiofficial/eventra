import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/features/auth/auth.session";

const protectedRoutes = ["/accounts"];
const adminRoutes = ["/admin"];
const authRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to login if accessing protected route without session
  if ((isProtectedRoute || isAdminRoute) && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // For admin routes, we do optimistic check here, but
  // verify admin role in the actual page/action for security

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
