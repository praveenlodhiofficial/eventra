import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { AddVenueModal } from "@/components/modals/venue/add-venue-modal";
import { Container } from "@/components/ui/container";

export default async function AdminPage() {
  return (
    <Container>
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <AddVenueModal />
        <PerformerModal type="create" />
      </div>
    </Container>
  );
}
