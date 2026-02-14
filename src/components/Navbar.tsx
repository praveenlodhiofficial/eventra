import Image from "next/image";
import Link from "next/link";

import { IconLockShare } from "@tabler/icons-react";

import { getSession } from "@/domains/auth/auth.actions";

import { ActionButton1 } from "./ui/action-button";
import { MobileNav } from "./ui/mobile-nav";
import { NavbarMotion } from "./ui/navbar-motion";

export async function Navbar() {
  const session = await getSession();

  return (
    <NavbarMotion>
      <div className="flex w-full items-center justify-between bg-linear-to-b from-white via-white/80 to-transparent px-3 py-1 backdrop-blur-xs">
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={100}
            height={100}
            className="size-10 invert"
          />
          <h1 className="text-2xl font-semibold md:text-3xl">Eventra</h1>
        </Link>

        {/* ================= DESKTOP ================= */}
        <div className="hidden w-fit items-center overflow-hidden rounded-full p-2 pl-10 md:flex">
          <div className="flex items-center justify-start gap-10">
            <Link href={`/events`}> Events</Link>
            <Link href={`/categories`}> Categories</Link>
            <Link href={`/performers`}> Performers</Link>
          </div>

          {!session && (
            <div className="ml-5 flex gap-2 md:ml-10">
              <Link href="/sign-up">
                <ActionButton1
                  variant="secondary"
                  className="hidden cursor-pointer rounded-full px-5 md:px-8 lg:block"
                >
                  Sign Up
                </ActionButton1>
              </Link>

              <Link href="/sign-in">
                <ActionButton1
                  variant="default"
                  className="cursor-pointer rounded-full px-5 md:px-8"
                >
                  Sign In
                </ActionButton1>
              </Link>
            </div>
          )}

          {session?.role === "ADMIN" && (
            <Link href="/admin" className="ml-5 flex gap-2 md:ml-10">
              <ActionButton1
                variant="outline"
                icon={<IconLockShare className="size-5" />}
                className="cursor-pointer rounded-full"
                gap="gap-3 md:gap-6"
              >
                Admin
              </ActionButton1>
            </Link>
          )}
        </div>

        {/* ================= MOBILE ================= */}
        <MobileNav
          isAuthenticated={!!session}
          isAdmin={session?.role === "ADMIN"}
        />
      </div>
    </NavbarMotion>
  );
}
