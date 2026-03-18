import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { VenueModal } from "@/components/modals/venue/venue-modal";
import { Container } from "@/components/ui/container";

export default async function AdminPage() {
  return (
    <Container>
      <div className="flex w-full flex-wrap items-center justify-center gap-3">
        <VenueModal />
        <PerformerModal type="create" />
      </div>
    </Container>
  );
}
