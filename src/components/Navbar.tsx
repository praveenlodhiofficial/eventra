import { IconLockShare } from "@tabler/icons-react";

import { getSession } from "@/domains/auth/auth.actions";

import { ActionButton1 } from "./ui/action-button";

export async function Navbar() {
  const session = await getSession();

  return (
    <div className="absolute top-5 right-5 z-50 flex gap-2">
      {/* NOT AUTHENTICATED */}
      {!session && (
        <>
          <ActionButton1
            variant="outline"
            href="/sign-up"
            className="cursor-pointer bg-transparent px-10 text-sm text-white hover:bg-transparent hover:text-white"
          >
            Sign Up
          </ActionButton1>

          <ActionButton1
            variant="outline"
            href="/sign-in"
            className="cursor-pointer px-10 text-sm"
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
          className="flex cursor-pointer items-center text-sm"
        >
          Admin
        </ActionButton1>
      )}
    </div>
  );
}
