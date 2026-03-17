import { redirect } from "next/navigation";

import CreateEventPageClient from "@/components/events/CreateEventPageClient";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { listVenuesAction } from "@/domains/venue/venue.actions";

export default async function AdminCreateEventPage() {
  const [categoriesRes, venuesRes] = await Promise.all([
    listEventCategoriesAction(),
    listVenuesAction(),
  ]);

  if (!categoriesRes.success || !venuesRes.success) {
    throw new Error("Failed to load categories or venues");
  }

  const categories = categoriesRes.data ?? [];
  const venues = venuesRes.data ?? [];

  if (!categories.length || !venues.length) {
    // We can't create an event without categories and venues – go back to events list.
    redirect("/admin/events");
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="text-2xl font-semibold md:text-3xl">Create Event</h1>
      <p className="text-muted-foreground text-sm">
        Fill in the details below to create a new event. After creating the
        event you&apos;ll be able to add ticket types from the event details
        page.
      </p>

      <CreateEventPageClient categories={categories} />
    </div>
  );
}
