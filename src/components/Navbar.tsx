import Image from "next/image";
import Link from "next/link";

import * as motion from "motion/react-client";
import { IconLockShare } from "@tabler/icons-react";

import { getSession } from "@/domains/auth/auth.actions";

import { ActionButton1 } from "./ui/action-button";

export async function Navbar() {
  const session = await getSession();

  return (
    <div className="sticky inset-0 z-50 flex w-full items-center justify-between bg-linear-to-b from-white via-white/80 to-transparent px-3 py-1 backdrop-blur-xs">
      {/* ================================================ LOGO & TITLE ================================================ */}
      <div className="flex items-center">
        <Image
          src="/icons/logo.png"
          alt="logo"
          width={100}
          height={100}
          className="size-10 invert"
        />
        <h1 className="text-2xl font-semibold md:text-3xl">Eventra</h1>
      </div>

      {/* ================================================ NAV LINKS ================================================ */}
      <div className="bg-b flex w-fit items-center overflow-hidden rounded-full p-2 pl-10">
        <div className="flex items-center justify-start gap-10">
          <Link href={`/`}> Home</Link>
          <Link href={`/events`}> Events</Link>
          <Link href={`/categories`}> Categories</Link>
          <Link href={`/performers`}> Performers</Link>
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
    </div>
  );
}

// import Link from "next/link";

// import * as motion from "motion/react-client";
// import { IconLockShare } from "@tabler/icons-react";

// import { getSession } from "@/domains/auth/auth.actions";

// import { ActionButton1 } from "./ui/action-button";

// export async function Navbar() {
//   const session = await getSession();

//   return (
//     <div className="sticky top-2 right-2 z-50 flex w-fit items-center overflow-hidden rounded-full bg-black/40 p-2 pl-10 backdrop-blur-sm">
//       <div className="flex items-center justify-start gap-10 text-white">
//         <Link href={`/`}> Home</Link>
//         <Link href={`/events`}> Events</Link>
//         <Link href={`/categories`}> Categories</Link>
//         <Link href={`/performers`}> Performers</Link>
//       </div>

//       {/* NOT AUTHENTICATED */}
//       {!session && (
//         <div className="ml-5 flex gap-2 md:ml-10">
//           <Link href="/sign-up">
//             <ActionButton1
//               variant="outline"
//               className="cursor-pointer rounded-full bg-transparent px-5 text-white hover:bg-transparent hover:text-white md:px-8"
//             >
//               Sign Up
//             </ActionButton1>
//           </Link>

//           <Link href="/sign-in">
//             <ActionButton1
//               variant="outline"
//               className="cursor-pointer rounded-full px-5 md:px-8"
//             >
//               Sign In
//             </ActionButton1>
//           </Link>
//         </div>
//       )}

//       {/* AUTHENTICATED + ADMIN */}
//       <Link href="/admin" className="ml-5 flex gap-2 md:ml-10">
//         {session?.role === "ADMIN" && (
//           <ActionButton1
//             variant="outline"
//             icon={<IconLockShare className="size-5" />}
//             className="cursor-pointer rounded-full"
//           >
//             Admin
//           </ActionButton1>
//         )}
//       </Link>
//     </div>
//   );
// }
