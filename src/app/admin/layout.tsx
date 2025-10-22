import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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
