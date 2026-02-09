import { DeleteModal } from "@/components/modals/delete.modal";
import { EventCategoriesModal } from "@/components/modals/event-categories/event-categories-modal";
import { listEventCategoriesAction } from "@/domains/event-categories/event-categories.actions";
import { DeleteModalType } from "@/types/delete.types";

export default async function AdminEventCategoriesPage() {
  const res = await listEventCategoriesAction();

  if (!res.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching event categories data
      </div>
    );
  }

  const eventCategories = res.data;

  if (!eventCategories || eventCategories.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No event categories found</p>
        <EventCategoriesModal type="create" />
      </div>
    );
  }

  return (
    <div className="md:space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium md:text-3xl">Event Categories</h1>
        <EventCategoriesModal type="create" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {eventCategories.map((eventCategory) => (
          <div
            key={eventCategory.id}
            className="bg-accent relative flex aspect-3/4 h-full w-full items-center justify-center rounded-3xl p-4 text-center text-sm font-medium lg:items-end lg:text-lg"
          >
            {eventCategory.name}
            <div className="absolute top-3 right-3">
              <DeleteModal
                type={DeleteModalType.EVENT_CATEGORY}
                id={eventCategory.id}
                trigger="icon"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
