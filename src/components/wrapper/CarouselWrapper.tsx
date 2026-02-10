import { findEvents } from "@/domains/event/event.dal";

import { Carousel } from "../Carousel";

export async function CarouselWrapper() {
  const events = await findEvents();

  if (!events || events.length === 0) {
    return (
      <div className="bg-muted flex h-[20vh] w-full items-center justify-center rounded-3xl text-xl font-medium lg:h-[30vh]">
        No events found
      </div>
    );
  }

  const coverImage = events.map((event) => event.coverImage);
  const slug = events.map((event) => event.slug);

  return (
    <div>
      <Carousel coverImage={coverImage} slug={slug} />
    </div>
  );
}
