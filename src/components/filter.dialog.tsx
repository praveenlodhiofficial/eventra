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
import { XIcon } from "lucide-react";
import * as motion from "motion/react-client";
import { useState } from "react";
import { PiSlidersHorizontalBold } from "react-icons/pi";

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

interface FilterDialogBoxProps {
   open: boolean;
   onClose: () => void;
   onApply?: (filters: { sortOptions: string[]; subCategories: EventSubCategory[] }) => void;
}

function FilterDialogBox({ open, onClose, onApply }: FilterDialogBoxProps) {
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
      const sortOptionsArray = Array.from(selectedSortOptions);
      const subCategoriesArray = Array.from(selectedCategories).map(
         (cat) => cat as EventSubCategory
      );

      // Call the onApply callback with filter parameters
      if (onApply) {
         onApply({
            sortOptions: sortOptionsArray,
            subCategories: subCategoriesArray,
         });
      }

      onClose();
   };

   const renderContent = () => {
      if (selectedFilter === "sort-by") {
         return (
            <div className="space-y-0.5">
               {sortOptions.map((option) => (
                  <label
                     key={option.id}
                     className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 transition-all duration-150 hover:bg-gray-50"
                  >
                     <input
                        type="checkbox"
                        checked={selectedSortOptions.has(option.id)}
                        onChange={() => handleSortOptionToggle(option.id)}
                        className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer rounded border-gray-300"
                     />
                     <span className="text-[13px]">{option.label}</span>
                  </label>
               ))}
            </div>
         );
      } else if (selectedFilter === "category") {
         return (
            <div className="scrollbar-hide max-h-[calc(100vh-20rem)] space-y-0.5 overflow-y-auto">
               {/* sort alphabetically */}
               {allSubCategories
                  .sort((a, b) => a.label.localeCompare(b.label))
                  .map((category) => (
                     <label
                        key={category.id as string}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 transition-all duration-150 hover:bg-gray-50"
                     >
                        <input
                           type="checkbox"
                           checked={selectedCategories.has(category.id as string)}
                           onChange={() => handleCategoryToggle(category.id as string)}
                           className="text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer rounded border-gray-300"
                        />
                        <span className="text-[13px]">{category.label}</span>
                     </label>
                  ))}
            </div>
         );
      }
      return null;
   };

   if (!open) return null;

   return (
      <div
         className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs"
         onClick={onClose}
      >
         <motion.div
            className="relative flex h-[calc(100vh-7rem)] w-2xl flex-col gap-5 overflow-hidden rounded-xl bg-white p-6 shadow-xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
         >
            <div className="flex w-full justify-between">
               <h1 className="text-xl font-semibold">Filter by</h1>
               <Button
                  variant="ghost"
                  className="absolute top-2 right-2 rounded px-2 py-1 text-xl font-bold hover:bg-gray-200"
                  onClick={onClose}
               >
                  <XIcon className="size-4" />
               </Button>
            </div>
            <div className="flex min-h-0 flex-1">
               <SidebarProvider className="min-h-0 w-full max-w-[10rem] flex-1">
                  <Sidebar collapsible="none" className="h-full bg-transparent">
                     <SidebarContent>
                        <SidebarGroup className="p-0">
                           <SidebarGroupContent>
                              <SidebarMenu className="gap-0">
                                 {items.map((item) => (
                                    <SidebarMenuItem key={item.id}>
                                       <SidebarMenuButton
                                          onClick={() => handleFilterSelect(item.id)}
                                          className={`rounded-lg ${selectedFilter === item.id ? "rounded-r-none bg-gradient-to-l from-gray-50 to-purple-200 px-3 py-5" : "rounded-r-none px-3 py-5 hover:bg-gray-50"}`}
                                       >
                                          <span className="text-[13px]">{item.title}</span>
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
               <div className="text-primary flex-1 overflow-y-auto rounded-r-xl bg-gradient-to-r from-gray-50 to-purple-200 p-3 pr-2">
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

interface FilterEventsButtonProps {
   onApply?: (filters: { sortOptions: string[]; subCategories: EventSubCategory[] }) => void;
}

export function FilterEventsButton(
   { onApply }: FilterEventsButtonProps = {} as FilterEventsButtonProps
) {
   const [openModal, setOpenModal] = useState(false);

   return (
      <>
         <Button
            variant="outline"
            className="cursor-pointer border-black text-xs"
            onClick={() => setOpenModal(true)}
         >
            <PiSlidersHorizontalBold className="size-3 md:size-4" />
            Filters
         </Button>
         <FilterDialogBox open={openModal} onClose={() => setOpenModal(false)} onApply={onApply} />
      </>
   );
}
