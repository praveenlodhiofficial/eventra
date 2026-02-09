import { SlidersHorizontal } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { ActionButton1, ActionButton2 } from "@/components/ui/action-button";
import { Container } from "@/components/ui/container";

export default function EventsPage() {
  return (
    <Container>
      <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
        <h1 className="text-2xl font-semibold md:text-3xl">Popular Events</h1>
        <div className="flex h-fit items-center justify-start gap-2 rounded-lg">
          <ActionButton1
            variant="secondary"
            icon={<SlidersHorizontal className="size-5" />}
            className="cursor-pointer rounded-r-full"
          >
            Filters
          </ActionButton1>
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
        <div className="flex gap-5">
          <EventCard />
        </div>
      </section>
    </Container>
  );
}
