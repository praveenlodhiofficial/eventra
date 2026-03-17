"use client";

import { useMemo, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Variants } from "motion/react";

import { LocationPickerDialog } from "@/components/location/LocationPickerDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ActionButton1, ActionButton2 } from "./ui/action-button";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { FieldGroup, FieldLabel } from "./ui/field";

type Category = { id: string; name: string; slug: string };

type Props = {
  categories: Category[];
  initialSort?: "date" | "name" | "price-low" | "price-high" | "distance";
  initialCategoryIds?: string[];
  initialLocation?: { name: string; lat: number; lng: number } | null;
};

export function FilterEvents({
  categories,
  initialSort = "date",
  initialCategoryIds = [],
  initialLocation = null,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sort-by");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [draftSort, setDraftSort] = useState<
    "date" | "name" | "price-low" | "price-high" | "distance"
  >(initialSort);
  const [draftCategoryIds, setDraftCategoryIds] =
    useState<string[]>(initialCategoryIds);
  const [draftLocation, setDraftLocation] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(initialLocation);

  const sortOptions = useMemo(
    () =>
      [
        { id: "name", label: "Name" },
        { id: "price-low", label: "Price - Low to High" },
        { id: "price-high", label: "Price - High to Low" },
        { id: "date", label: "Date" },
        { id: "distance", label: "Distance: Near to Far" },
      ] as const,
    []
  );

  const applyToUrl = (next: {
    sort: Props["initialSort"];
    categoryIds: string[];
    location: Props["initialLocation"];
  }) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (next.sort && next.sort !== "date") params.set("sort", next.sort);
    else params.delete("sort");

    if (next.categoryIds.length)
      params.set("categories", next.categoryIds.join(","));
    else params.delete("categories");

    if (next.sort === "distance" && next.location) {
      params.set("lat", String(next.location.lat));
      params.set("lng", String(next.location.lng));
      params.set("location", next.location.name);
    } else {
      params.delete("lat");
      params.delete("lng");
      params.delete("location");
    }

    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  const onReset = () => {
    setDraftSort("date");
    setDraftCategoryIds([]);
    setDraftLocation(null);
    applyToUrl({ sort: "date", categoryIds: [], location: null });
    setIsOpen(false);
  };

  const onApply = () => {
    if (draftSort === "distance" && !draftLocation) {
      setIsLocationOpen(true);
      return;
    }
    applyToUrl({
      sort: draftSort,
      categoryIds: draftCategoryIds,
      location: draftLocation,
    });
    setIsOpen(false);
  };

  // ✅ Stagger container
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // ✅ Item animation
  const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <>
      <LocationPickerDialog
        open={isLocationOpen}
        onOpenChange={setIsLocationOpen}
        title="Choose location for distance sort"
        value={draftLocation}
        onSelect={(loc) => {
          setDraftLocation(loc);
          applyToUrl({
            sort: "distance",
            categoryIds: draftCategoryIds,
            location: loc,
          });
          setIsOpen(false);
        }}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
        <DialogTrigger asChild>
          <ActionButton1
            variant="secondary"
            icon={<SlidersHorizontal className="size-5" />}
            className="cursor-pointer rounded-r-full"
          >
            Filters
          </ActionButton1>
        </DialogTrigger>

        <DialogContent className="flex h-full w-full flex-col gap-2 rounded-none md:h-[calc(100vh-7rem)] md:max-w-3xl lg:rounded-3xl">
          <DialogHeader className="h-fit">
            <DialogTitle className="px-5 py-1 text-center text-base font-semibold uppercase md:text-lg lg:text-xl">
              Apply Filters
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            orientation="vertical"
            className="h-full gap-0 bg-transparent"
          >
            <TabsList className="w-40 rounded-none bg-transparent p-0">
              <TabsTrigger
                value="sort-by"
                className="data-[state=active]:bg-muted data-[state=active]:text-primary cursor-pointer rounded-l-xl rounded-r-none border-0 px-4 py-3 text-sm group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none md:text-base"
              >
                Sort By
              </TabsTrigger>
              <TabsTrigger
                value="category"
                className="data-[state=active]:bg-muted data-[state=active]:text-primary cursor-pointer rounded-l-xl rounded-r-none border-0 px-4 py-3 text-sm group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none md:text-base"
              >
                Category
              </TabsTrigger>
            </TabsList>

            {/* ✅ Animated Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === "sort-by" && (
                  <TabsContent
                    value="sort-by"
                    forceMount
                    asChild
                    key="sort-by"
                    className="bg-muted h-full rounded-xl rounded-tl-none"
                  >
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <FieldGroup className="gap-4 rounded-xl px-6 py-3">
                        {sortOptions.map((itemData) => (
                          <motion.div
                            key={itemData.id}
                            variants={item}
                            className="flex flex-row items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={itemData.id}
                                checked={draftSort === itemData.id}
                                onCheckedChange={(checked) => {
                                  if (checked) setDraftSort(itemData.id);
                                }}
                                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-full border-2"
                              />
                              <FieldLabel
                                htmlFor={itemData.id}
                                className="cursor-pointer text-sm font-medium md:text-base"
                              >
                                {itemData.label}
                              </FieldLabel>
                            </div>

                            {itemData.id === "distance" && draftLocation && (
                              <button
                                type="button"
                                onClick={() => setIsLocationOpen(true)}
                                className="text-muted-foreground hover:text-primary line-clamp-1 max-w-[45%] text-right text-xs underline underline-offset-4 md:text-sm"
                              >
                                {draftLocation.name}
                              </button>
                            )}
                          </motion.div>
                        ))}
                      </FieldGroup>
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === "category" && (
                  <TabsContent
                    value="category"
                    forceMount
                    asChild
                    key="category"
                    className="bg-muted h-full rounded-xl"
                  >
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                    >
                      <FieldGroup className="gap-4 px-6 py-3">
                        {categories.map((c) => (
                          <motion.div
                            key={c.id}
                            variants={item}
                            className="flex flex-row items-center gap-3"
                          >
                            <Checkbox
                              id={c.id}
                              checked={draftCategoryIds.includes(c.id)}
                              onCheckedChange={(checked) => {
                                setDraftCategoryIds((prev) => {
                                  const set = new Set(prev);
                                  if (checked) set.add(c.id);
                                  else set.delete(c.id);
                                  return Array.from(set);
                                });
                              }}
                              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground size-4 rounded-full border-2"
                            />
                            <FieldLabel
                              htmlFor={c.id}
                              className="cursor-pointer text-sm font-medium md:text-base"
                            >
                              {c.name}
                            </FieldLabel>
                          </motion.div>
                        ))}
                      </FieldGroup>
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            </div>
          </Tabs>

          {/* Actions */}
          <div className="mt-0.5 ml-40 grid grid-cols-2 items-center gap-2">
            <ActionButton2
              variant="outline"
              size="lg"
              className="w-full"
              onClick={onReset}
              type="button"
            >
              Reset
            </ActionButton2>
            <ActionButton2
              variant="default"
              size="lg"
              className="w-full"
              onClick={onApply}
              type="button"
            >
              Apply
            </ActionButton2>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
