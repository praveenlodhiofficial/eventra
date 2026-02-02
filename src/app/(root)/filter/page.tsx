"use client";

import { Button } from "@/components/ui/button";
import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarProvider,
} from "@/components/ui/sidebar";
import { EventSubCategory } from "@/generated/prisma";
import { subCategoryLabels } from "@/lib/event-categories";
import * as motion from "motion/react-client";
import { useState } from "react";

// Menu items.
const items = [
   {
      title: "Sort By",
      id: "sort-by",
   },
   {
      title: "Category",
      id: "category",
   },
];

// Sort options
const sortOptions = [
   { id: "date-newest", label: "Date (Newest First)" },
   { id: "date-oldest", label: "Date (Oldest First)" },
   { id: "price-low", label: "Price (Low to High)" },
   { id: "price-high", label: "Price (High to Low)" },
   { id: "popularity", label: "Popularity" },
   { id: "name-asc", label: "Name (A-Z)" },
   { id: "name-desc", label: "Name (Z-A)" },
];

// Get all subcategories
const allSubCategories = Object.values(EventSubCategory).map((subCat) => ({
   id: subCat as string,
   label: subCategoryLabels[subCat as EventSubCategory],
}));

export default function FilterPage() {
   const [selectedFilter, setSelectedFilter] = useState<string>("sort-by");
   const [selectedSortOptions, setSelectedSortOptions] = useState<Set<string>>(new Set());
   const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

   const handleFilterSelect = (filterId: string) => {
      setSelectedFilter(filterId);
   };

   const handleSortOptionToggle = (optionId: string) => {
      setSelectedSortOptions((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(optionId)) {
            newSet.delete(optionId);
         } else {
            newSet.add(optionId);
         }
         return newSet;
      });
   };

   const handleCategoryToggle = (categoryId: string) => {
      setSelectedCategories((prev) => {
         const newSet = new Set(prev);
         if (newSet.has(categoryId)) {
            newSet.delete(categoryId);
         } else {
            newSet.add(categoryId);
         }
         return newSet;
      });
   };

   const handleClearFilters = () => {
      setSelectedSortOptions(new Set());
      setSelectedCategories(new Set());
   };

   const handleApplyFilters = () => {
      // TODO: Implement filter application logic
      console.log("Sort Options:", Array.from(selectedSortOptions));
      console.log("Categories:", Array.from(selectedCategories));
   };

   const renderContent = () => {
      if (selectedFilter === "sort-by") {
         return (
            <div className="space-y-3">
               {sortOptions.map((option) => (
                  <label
                     key={option.id}
                     className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50"
                  >
                     <input
                        type="checkbox"
                        checked={selectedSortOptions.has(option.id)}
                        onChange={() => handleSortOptionToggle(option.id)}
                        className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                     />
                     <span className="text-sm">{option.label}</span>
                  </label>
               ))}
            </div>
         );
      } else if (selectedFilter === "category") {
         return (
            <div className="scrollbar-hide max-h-[calc(100vh-20rem)] space-y-3 overflow-y-auto">
               {/* sort alphabetically */}
               {allSubCategories
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((category) => (
                     <label
                        key={category.id as string}
                        className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-50"
                     >
                        <input
                           type="checkbox"
                           checked={selectedCategories.has(category.id as string)}
                           onChange={() => handleCategoryToggle(category.id as string)}
                           className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                        />
                        <span className="text-sm">{category.label}</span>
                     </label>
                  ))}
            </div>
         );
      }
      return null;
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
         <motion.div
            className="relative flex h-[calc(100vh-7rem)] w-2xl flex-col gap-5 overflow-hidden rounded-xl bg-white p-6 shadow-xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
         >
            <h1 className="text-xl font-semibold">Filter by</h1>
            <div className="flex min-h-0 flex-1">
               <SidebarProvider className="min-h-0 w-full max-w-[10rem] flex-1">
                  <Sidebar collapsible="none" className="h-full bg-transparent">
                     <SidebarContent>
                        <SidebarGroup className="py-2">
                           <SidebarGroupContent>
                              <SidebarMenu>
                                 {items.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                       <SidebarMenuButton
                                          onClick={() => handleFilterSelect(item.id)}
                                          className={
                                             selectedFilter === item.id
                                                ? "text-primary rounded-none bg-gradient-to-r from-purple-50/20 to-purple-200"
                                                : ""
                                          }
                                       >
                                          <span>{item.title}</span>
                                       </SidebarMenuButton>
                                    </SidebarMenuItem>
                                 ))}
                              </SidebarMenu>
                           </SidebarGroupContent>
                        </SidebarGroup>
                     </SidebarContent>
                  </Sidebar>
               </SidebarProvider>

               {/* Content Area */}
               <div className="text-primary flex-1 overflow-y-auto bg-gradient-to-r from-purple-50/20 to-purple-200 p-3 pr-2">
                  {renderContent()}
               </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t pt-4">
               <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-600 underline decoration-dotted hover:text-gray-900"
               >
                  Clear filters
               </button>
               <Button
                  onClick={handleApplyFilters}
                  className="bg-black text-white hover:bg-gray-800"
               >
                  Apply Filters
               </Button>
            </div>
         </motion.div>
      </div>
   );
}
