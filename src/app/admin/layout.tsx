import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getCurrentUser } from "@/features/user";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
   // Check if user is authenticated and has admin role
   const user = await getCurrentUser({ withFullUser: true, redirectIfNotFound: true });

   if (user.role !== "ADMIN") {
      redirect("/");
   }

   return (
      <SidebarProvider>
         <AdminSidebar />
         <main className="h-full w-full">
            <SidebarTrigger />
            <div className="h-full w-full p-5">{children}</div>
         </main>
      </SidebarProvider>
   );
}
