import { IconLockShare } from "@tabler/icons-react";

import { getSession } from "@/domains/auth/auth.actions";

import { ActionButton1 } from "./ui/action-button";

export async function Navbar() {
  const session = await getSession();

  return (
    <div className="absolute top-3 right-3 z-50 flex gap-2 md:top-5 md:right-5">
      {/* NOT AUTHENTICATED */}
      {!session && (
        <>
          <ActionButton1
            variant="outline"
            href="/sign-up"
            className="cursor-pointer bg-transparent px-5 text-white hover:bg-transparent hover:text-white md:px-10"
          >
            Sign Up
          </ActionButton1>

          <ActionButton1
            variant="outline"
            href="/sign-in"
            className="cursor-pointer px-5 md:px-10"
          >
            Sign In
          </ActionButton1>
        </>
      )}

      {/* AUTHENTICATED + ADMIN */}
      {session?.role === "ADMIN" && (
        <ActionButton1
          variant="outline"
          href="/admin"
          icon={<IconLockShare className="size-5" />}
          className="cursor-pointer"
        >
          Admin
        </ActionButton1>
      )}
    </div>
  );
}
