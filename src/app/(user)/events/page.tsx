import { SlidersHorizontal } from "lucide-react";

import { ActionButton1, ActionButton2 } from "@/components/ui/action-button";
import { EventsWrapper } from "@/components/wrapper/EventsWrapper";

export default function EventsPage() {
  return (
    <div className="space-y-5 md:space-y-8">
      <h1 className="bg-muted-foreground/10 p-2 text-center text-base font-semibold uppercase md:text-xl">
        All Events
      </h1>
      <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
        <div className="no-scrollbar flex h-fit w-[calc(105%)] items-center justify-start gap-2 overflow-x-auto rounded-lg">
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
          <EventsWrapper />
        </div>
      </section>
    </div>
  );
}
