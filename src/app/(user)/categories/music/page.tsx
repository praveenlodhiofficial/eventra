import { EventCard } from "@/components/EventCard";
import { Container } from "@/components/ui/container";

export default function MusicCategoryPage() {
  return (
    <Container className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
      <h1 className="text-2xl font-semibold md:text-3xl">Music Category</h1>
      <div className="flex gap-5">
        <EventCard />
      </div>
    </Container>
  );
}
