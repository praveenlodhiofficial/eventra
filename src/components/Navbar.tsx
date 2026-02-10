import Link from "next/link";

import * as motion from "motion/react-client";
import { IconLockShare } from "@tabler/icons-react";

import { getSession } from "@/domains/auth/auth.actions";

import { ActionButton1 } from "./ui/action-button";

export async function Navbar() {
  const session = await getSession();

  return (
    <div className="absolute top-3 right-3 z-50 flex w-fit items-center overflow-hidden rounded-full bg-black/40 p-2 pl-10 backdrop-blur-sm md:top-5 md:right-5">
      <div className="flex items-center justify-start gap-10 text-white">
        <Link href={`/`}> Home</Link>
        <Link href={`/events`}> Events</Link>
        <Link href={`/performers`}> Performers</Link>
        <Link href={`/venues`}> Venues</Link>
      </div>

      {/* NOT AUTHENTICATED */}
      {!session && (
        <div className="ml-5 flex gap-2 md:ml-10">
          <Link href="/sign-up">
            <ActionButton1
              variant="outline"
              className="cursor-pointer rounded-full bg-transparent px-5 text-white hover:bg-transparent hover:text-white md:px-8"
            >
              Sign Up
            </ActionButton1>
          </Link>

          <Link href="/sign-in">
            <ActionButton1
              variant="outline"
              className="cursor-pointer rounded-full px-5 md:px-8"
            >
              Sign In
            </ActionButton1>
          </Link>
        </div>
      )}

      {/* AUTHENTICATED + ADMIN */}
      <Link href="/admin" className="ml-5 flex gap-2 md:ml-10">
        {session?.role === "ADMIN" && (
          <ActionButton1
            variant="outline"
            icon={<IconLockShare className="size-5" />}
            className="cursor-pointer rounded-full"
          >
            Admin
          </ActionButton1>
        )}
      </Link>
    </div>
  );
}
