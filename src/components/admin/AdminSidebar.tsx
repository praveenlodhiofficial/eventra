import { BsCalendarEvent, BsGrid3X3 } from "react-icons/bs";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
   {
      title: "Dashboard",
      url: "/admin",
      icon: BsGrid3X3,
   },
   {
      title: "Events",
      url: "/admin/events",
      icon: BsCalendarEvent,
   },
];

export function AdminSidebar() {
   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Eventra Admin Dashboard</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu className="mt-5">
                     {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton asChild>
                              <a href={item.url}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </a>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
