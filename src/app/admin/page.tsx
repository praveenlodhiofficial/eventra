import { CreateEventModal } from "@/components/modals/events/create-event-modal";
import { AddPerformerModal } from "@/components/modals/performer/add-performer-modal";
import { AddVenueModal } from "@/components/modals/venue/add-venue-modal";
import { GetAllPerformersAction } from "@/domains/performer/performer.actions";

export default async function AdminPage() {
  const res = await GetAllPerformersAction();

  if (!res.success) {
    return <div>Error fetching performers data</div>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="border-primary z-50 flex max-w-md flex-col gap-5 border-2 bg-amber-500">
        <CreateEventModal />
        <AddVenueModal />
        <AddPerformerModal />
      </div>
    </div>
  );
}
