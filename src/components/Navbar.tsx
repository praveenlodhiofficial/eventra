import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { removeUserFromSession } from "@/features/auth/auth.session";
import { getCurrentUser } from "@/features/user";
import { LogOut, Settings, User } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function handleLogout() {
   "use server";
   const cookieStore = await cookies();
   await removeUserFromSession(cookieStore);
   redirect("/");
}

export default async function Navbar() {
   // Get current user from session
   const user = await getCurrentUser({ withFullUser: true });
   return (
      <div className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border bg-gradient-to-t from-transparent to-white px-3 py-1.5 backdrop-blur-lg md:px-5 md:py-3 lg:px-10">
         {/* Logo Section ---------------------------------------------------------------> */}
         <Link href="/" className="flex items-start gap-2 md:items-end">
            <Image
               src="/icon/logo3.png"
               alt="Eventra"
               width={100}
               height={100}
               className="bottom-0.56 relative h-6 w-full object-cover md:h-7 md:w-full"
            />
            {/* <h1 className="text-xl font-semibold md:text-2xl">Eventra</h1> */}
         </Link>

         {/* Navigation Menu Section ---------------------------------------------------------------> */}
         <div className="hidden items-center justify-center gap-10 text-sm md:flex">
            <Link href="/events">Discover Events</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            {user?.role === "ADMIN" && (
               <Link
                  href="/admin"
                  className="text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  Admin Panel
               </Link>
            )}
         </div>

         {/* User Authentication Section ---------------------------------------------------------------> */}
         {!user && (
            <div className="flex items-center gap-2">
               <Button variant="secondary" className="">
                  <Link href="/sign-up">Sign Up</Link>
               </Button>
               <Button variant="default" className="">
                  <Link href="/sign-in">Sign In</Link>
               </Button>
            </div>
         )}

         {/* User Profile Section ---------------------------------------------------------------> */}
         {user && (
            <div className="flex scale-90 items-center gap-2 md:scale-100">
               {/* User Profile Popover */}
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant="ghost"
                        className="group relative h-10 w-10 cursor-pointer rounded-full p-0"
                     >
                        <Avatar className="h-10 w-10">
                           <AvatarImage
                              src={user.imageUrl || ""}
                              alt={user.name}
                              className="scale-150 object-cover transition-all duration-200 group-hover:scale-140"
                           />
                           <AvatarFallback className="bg-gray-200 font-semibold text-gray-800">
                              {user.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")
                                 .toUpperCase()}
                           </AvatarFallback>
                        </Avatar>
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                     <div className="p-4">
                        {/* User Info Section ---------------------------------------------------------------> */}
                        <div className="mb-4 flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                              <AvatarImage
                                 src={user.imageUrl || ""}
                                 alt={user.name}
                                 className="scale-150 object-cover"
                              />
                              <AvatarFallback className="bg-gray-200 text-xl font-semibold text-gray-800">
                                 {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                           <div className="flex-1">
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-[13px] text-zinc-600">{user.email}</p>
                           </div>
                        </div>

                        <Separator className="mb-3" />

                        {/* Menu Options Section ---------------------------------------------------------------> */}
                        <div className="space-y-1">
                           <Link href="/me">
                              <Button
                                 variant="ghost"
                                 className="h-10 w-full justify-start gap-3 px-3"
                              >
                                 <User className="h-4 w-4" />
                                 <span>Profile</span>
                              </Button>
                           </Link>

                           <Link href="/settings">
                              <Button
                                 variant="ghost"
                                 className="h-10 w-full justify-start gap-3 px-3"
                              >
                                 <Settings className="h-4 w-4" />
                                 <span>Settings</span>
                              </Button>
                           </Link>

                           <Separator className="my-2" />

                           <form action={handleLogout}>
                              <Button
                                 type="submit"
                                 variant="ghost"
                                 className="h-10 w-full justify-start gap-3 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                 <LogOut className="h-4 w-4" />
                                 <span>Log out</span>
                              </Button>
                           </form>
                        </div>
                     </div>
                  </PopoverContent>
               </Popover>
            </div>
         )}
      </div>
   );
}
