import { DeleteModal } from "@/components/modals/delete.modal";
import { EventCategoriesModal } from "@/components/modals/event-categories/event-categories-modal";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { DeleteModalType } from "@/types/delete.types";

export default async function AdminEventCategoriesPage() {
  const res = await listEventCategoriesAction();

  if (!res.success) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Event Categories
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Organize events into browsable categories.
          </p>
        </div>

        <div className="bg-destructive/5 text-destructive border-destructive/20 rounded-3xl border p-6">
          <div className="text-base font-semibold">Something went wrong</div>
          <div className="text-sm opacity-90">
            We couldn’t fetch event categories right now. Please refresh the
            page and try again.
          </div>
        </div>
      </div>
    );
  }

  const eventCategories = res.data;

  if (!eventCategories || eventCategories.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Event Categories
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Organize events into browsable categories.
            </p>
          </div>
          <EventCategoriesModal type="create" />
        </div>

        <div className="bg-muted/20 rounded-3xl border p-10">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
            <div className="bg-accent text-muted-foreground flex h-12 w-12 items-center justify-center rounded-2xl border text-lg">
              <span aria-hidden>🏷️</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">No categories yet</div>
              <div className="text-muted-foreground text-sm">
                Create categories so users can discover events faster.
              </div>
            </div>
            <div className="pt-2">
              <EventCategoriesModal type="create" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Event Categories
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {eventCategories.length} categor
            {eventCategories.length === 1 ? "y" : "ies"} total.
          </p>
        </div>
        <EventCategoriesModal type="create" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {eventCategories.map((eventCategory) => (
          <div
            key={eventCategory.id}
            className="group bg-accent/60 hover:bg-accent group relative flex aspect-3/4 h-full w-full cursor-pointer items-center justify-center rounded-3xl border p-4 text-center text-sm font-medium transition-colors lg:items-end lg:text-lg"
          >
            {eventCategory.name}
            <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex flex-col gap-2">
                <EventCategoriesModal
                  type="update"
                  eventCategory={eventCategory}
                />
                <DeleteModal
                  type={DeleteModalType.EVENT_CATEGORY}
                  id={eventCategory.id}
                  trigger="icon"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
