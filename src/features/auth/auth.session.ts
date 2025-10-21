import { Cookies, UserSession } from "@/features/auth/auth.types";
import config from "@/lib/config";
import { redisClient } from "@/lib/redis";
import crypto from "crypto";
import { z } from "zod";

const {
   env: {
      session: { expirationSeconds, cookieSessionKey },
   },
} = config;

const sessionSchema = z.object({
   id: z.string(),
   role: z.string(),
});

export function getUserFromSession(cookies: Pick<Cookies, "get">) {
   const sessionId = cookies.get(cookieSessionKey)?.value;
   if (sessionId == null) return null;

   return getUserSessionById(sessionId);
}

export async function updateUserSessionData(user: UserSession, cookies: Pick<Cookies, "get">) {
   const sessionId = cookies.get(cookieSessionKey)?.value;
   if (sessionId == null) return null;

   await redisClient.set(`session:${sessionId}`, sessionSchema.parse(user), {
      ex: Number(expirationSeconds),
   });
}

export async function createUserSession(user: UserSession, cookies: Pick<Cookies, "set">) {
   try {
      console.log("Creating session for user:", user);
      const sessionId = crypto.randomBytes(512).toString("hex").normalize();
      console.log("Generated session ID:", sessionId);

      const parsedUser = sessionSchema.parse(user);
      console.log("Parsed user for session:", parsedUser);

      await redisClient.set(`session:${sessionId}`, parsedUser, {
         ex: Number(expirationSeconds),
      });
      console.log("Session stored in Redis successfully");

      setCookie(sessionId, cookies);
      console.log("Cookie set successfully");
   } catch (error) {
      console.error("Error in createUserSession:", error);
      throw error;
   }
}

export async function updateUserSessionExpiration(cookies: Pick<Cookies, "get" | "set">) {
   const sessionId = cookies.get(cookieSessionKey)?.value;
   if (sessionId == null) return null;

   const user = await getUserSessionById(sessionId);
   if (user == null) return;

   await redisClient.set(`session:${sessionId}`, user, {
      ex: Number(expirationSeconds),
   });
   setCookie(sessionId, cookies);
}

export async function removeUserFromSession(cookies: Pick<Cookies, "get" | "delete">) {
   const sessionId = cookies.get(cookieSessionKey)?.value;
   if (sessionId == null) return null;

   await redisClient.del(`session:${sessionId}`);
   cookies.delete(cookieSessionKey);
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
   cookies.set(cookieSessionKey, sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: Date.now() + Number(expirationSeconds) * 1000,
   });
}

async function getUserSessionById(sessionId: string) {
   const rawUser = await redisClient.get(`session:${sessionId}`);

   const { success, data: user } = sessionSchema.safeParse(rawUser);

   return success ? user : null;
}
