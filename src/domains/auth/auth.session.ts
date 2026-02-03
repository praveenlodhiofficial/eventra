import { cookies } from "next/headers";

import { jwtVerify, SignJWT } from "jose";
import "server-only";

import { SessionPayload } from "@/domains/auth/auth.schema";
import { config } from "@/lib/config";

const encodedKey = new TextEncoder().encode(config.session.secret);

/* -------------------------------------------------------------------------- */
/*                          ENCRYPT SESSION                                   */
/* -------------------------------------------------------------------------- */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(config.session.expiration)
    .sign(encodedKey);
}

/* -------------------------------------------------------------------------- */
/*                          DECRYPT SESSION                                   */
/* -------------------------------------------------------------------------- */
export async function decrypt(session: string | undefined = "") {
  try {
    if (!session) {
      return null;
    }

    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/*                           CREATE SESSION                                   */
/* -------------------------------------------------------------------------- */
export async function createSession(userId: string, role: "USER" | "ADMIN") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  // const expiresAt = new Date(Date.now() + parseInt(config.session.expiration_time));
  const session = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/* -------------------------------------------------------------------------- */
/*                           UPDATE SESSION                                   */
/* -------------------------------------------------------------------------- */
export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  // const expires = new Date(Date.now() + parseInt(config.session.expiration_time));

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

/* -------------------------------------------------------------------------- */
/*                           DELETE SESSION                                   */
/* -------------------------------------------------------------------------- */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
