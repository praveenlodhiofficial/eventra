import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { decrypt } from "@/domains/auth/auth.session";

const publicRoutes = ["/", "/sign-in", "/sign-up"];
const adminRoutes = ["/admin"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isPublic = publicRoutes.includes(path);
  const isAdmin = adminRoutes.some((r) => path.startsWith(r));

  const cookie = (await cookies()).get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // not logged in → block admin
  if (isAdmin && !session?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // logged in but not admin → block admin
  if (isAdmin && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
