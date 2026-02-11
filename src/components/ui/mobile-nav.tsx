"use client";

import { useState } from "react";

import Link from "next/link";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "./button";

type Props = {
  isAuthenticated: boolean;
  isAdmin: boolean;
};

export function MobileNav({ isAuthenticated, isAdmin }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger */}
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="size-6" />
      </Button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-100">
            {/* ================= Overlay ================= */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 h-screen w-screen bg-black/40"
            />

            {/* ================= Drawer ================= */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute top-0 right-0 h-screen w-[70%] bg-white/95"
            >
              {/* Close */}
              <div className="flex justify-end px-2.5 py-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-7" />
                </Button>
              </div>

              {/* Links */}
              <div className="flex flex-col items-start gap-3 p-5 pt-10 text-lg font-medium">
                <Link onClick={() => setOpen(false)} href="/">
                  Home
                </Link>
                <Link onClick={() => setOpen(false)} href="/events">
                  Events
                </Link>
                <Link onClick={() => setOpen(false)} href="/categories">
                  Categories
                </Link>
                <Link onClick={() => setOpen(false)} href="/performers">
                  Performers
                </Link>

                <div className="mt-10 w-[70%] self-end">
                  {!isAuthenticated && (
                    <div className="mt-6 flex flex-col gap-3">
                      <Link onClick={() => setOpen(false)} href="/sign-up">
                        <Button variant="outline" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                      <Link onClick={() => setOpen(false)} href="/sign-in">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                    </div>
                  )}

                  {isAdmin && (
                    <Link onClick={() => setOpen(false)} href="/admin">
                      <Button variant="outline" className="w-full text-center">
                        Admin
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
