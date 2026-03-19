import { FilterEvents } from "@/components/FilterEvents";
import { ActionButton2 } from "@/components/ui/action-button";
import { EventsWrapper } from "@/components/wrapper/EventsWrapper";
import { findEventCategories } from "@/domains/event-categories/event-categories.dal";

export default async function EventsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const sort =
    typeof sp.sort === "string" && sp.sort.length
      ? (sp.sort as "date" | "name" | "price-low" | "price-high" | "distance")
      : "date";
  const categoryIds =
    typeof sp.categories === "string" && sp.categories.length
      ? sp.categories.split(",").filter(Boolean)
      : [];
  const initialLocation =
    typeof sp.lat === "string" &&
    typeof sp.lng === "string" &&
    typeof sp.location === "string" &&
    sp.lat.length &&
    sp.lng.length &&
    sp.location.length
      ? {
          name: sp.location,
          lat: Number(sp.lat),
          lng: Number(sp.lng),
        }
      : null;

  const categories = await findEventCategories();

  return (
    <div className="space-y-5 md:space-y-8">
      <h1 className="bg-muted-foreground/10 p-2 text-center text-base font-semibold uppercase md:text-xl">
        All Events
      </h1>
      <section className="w-full max-w-7xl space-y-5 md:space-y-8 lg:mx-auto">
        <div className="no-scrollbar mx-3 flex h-fit items-center justify-start gap-2 overflow-x-auto rounded-lg md:mx-5 md:gap-3">
          <FilterEvents
            categories={categories}
            initialSort={sort}
            initialCategoryIds={categoryIds}
            initialLocation={
              initialLocation &&
              Number.isFinite(initialLocation.lat) &&
              Number.isFinite(initialLocation.lng)
                ? initialLocation
                : null
            }
          />
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            Today
          </ActionButton2>
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            Tomorrow
          </ActionButton2>
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            This Weekend
          </ActionButton2>
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            Under 10 Km
          </ActionButton2>
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            Music
          </ActionButton2>
          <ActionButton2
            variant="secondary"
            className="cursor-pointer rounded-full"
          >
            Concerts
          </ActionButton2>
        </div>
        <div className="flex gap-5 px-3 md:px-5">
          <EventsWrapper
            take={15}
            sort={sort}
            categoryIds={categoryIds}
            near={
              initialLocation &&
              Number.isFinite(initialLocation.lat) &&
              Number.isFinite(initialLocation.lng)
                ? { lat: initialLocation.lat, lng: initialLocation.lng }
                : null
            }
          />
        </div>
      </section>
    </div>
  );
}
