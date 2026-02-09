import Link from "next/link";

import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { findEventCategories } from "@/domains/event-categories/event-categories.dal";

const eventCategories = [
  { label: "Music" },
  { label: "Nightlife" },
  { label: "Comedy" },
  { label: "Sports" },
  { label: "Performances" },
  { label: "Food & Drinks" },
  { label: "Fests & Fairs" },
  { label: "Social Mixers" },
  { label: "Screenings" },
  { label: "Fitness" },
  { label: "Art Exhibitions" },
  { label: "Conferences" },
  { label: "Open Mics" },
];

export async function EventCategories() {
  const categories = await findEventCategories();

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-muted flex h-[20vh] w-full items-center justify-center rounded-3xl text-xl font-medium lg:h-[30vh]">
        No event categories found
      </div>
    );
  }

  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-2 gap-3 md:gap-5">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.id}>
            <div className="bg-accent flex aspect-3/4 h-[18vh] items-center justify-center rounded-3xl p-4 text-center text-sm font-medium md:h-[20vh] md:items-end md:text-lg md:font-semibold lg:h-[30vh]">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
