import { CreateEventModal } from "@/components/modals/events/create-event-modal";
import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { AddVenueModal } from "@/components/modals/venue/add-venue-modal";
import { Container } from "@/components/ui/container";
import { GetAllPerformersAction } from "@/domains/performer/performer.actions";

export default async function AdminPage() {
  const res = await GetAllPerformersAction();

  if (!res.success) {
    return <div>Error fetching performers data</div>;
  }

  const performers = res.performers;

  if (!performers) {
    return <div>No performers found</div>;
  }

  return (
    <Container>
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <CreateEventModal />
        <AddVenueModal />
        <PerformerModal type="create" />
      </div>
      <div className="grid gap-5">
        {performers.map((performer) => (
          <div
            key={performer.id}
            className="bg-muted-foreground/10 flex items-center justify-between rounded-lg px-3 py-2"
          >
            <h1 className="text-base font-medium md:text-lg">
              {performer.name}
            </h1>
            <PerformerModal type="update" performer={performer} />
          </div>
        ))}
      </div>
    </Container>
  );
}
