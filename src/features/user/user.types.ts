import { getUserFromSession } from "@/features/auth/auth.session";

export type FullUser = {
   id: string;
   email: string;
   role: string;
   name: string;
   phone?: string | null;
   address?: string | null;
   city?: string | null;
   state?: string | null;
   country?: string | null;
   pinCode?: string | null;
   imageUrl?: string | null;
};

export type User = Exclude<Awaited<ReturnType<typeof getUserFromSession>>, undefined | null>;
