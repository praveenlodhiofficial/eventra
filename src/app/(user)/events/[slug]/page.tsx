import Link from "next/link";

import { Image } from "@imagekit/next";
import { formatDate, isSameDay } from "date-fns";
import {
  ArrowUpRight,
  Bookmark,
  CalendarCheckIcon,
  ClockIcon,
  MapPinIcon,
  Share2,
  TagIcon,
} from "lucide-react";

import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { AutoImageGrid } from "@/components/AutoImageGrid";
import { EventDetailBox } from "@/components/EventDetailBox";
import { ActionButton1, ActionButton2 } from "@/components/ui/action-button";
import { Container } from "@/components/ui/container";
import { ReadMore } from "@/components/ui/read-more";
import { Separator } from "@/components/ui/separator";
import { findEvent } from "@/domains/event/event.dal";
import { config } from "@/lib/config";

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const res = await findEvent({ slug });
  if (!res) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching event data
      </div>
    );
  }

  const event = res;
  if (!event) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Event not found
      </div>
    );
  }

  // lowest ticket price
  const lowestTicketPrice = Math.min(
    ...event.ticketTypes.map((ticket) => Number(ticket.price))
  );

  return (
    <div>
      <section className="relative mx-auto aspect-video w-full scale-x-98 overflow-hidden rounded-t-xl md:rounded-t-2xl lg:rounded-t-3xl">
        <Image
          urlEndpoint={config.imagekit.url_endpoint}
          src={event.coverImage}
          alt={event.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 flex gap-2 md:top-3 md:left-3">
          {event.categories.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.id}>
              <ActionButton2
                className="h-8 rounded-full capitalize md:text-base"
                variant="outline"
              >
                {category.name}
              </ActionButton2>
            </Link>
          ))}
        </div>

        <div className="absolute top-2 right-2 flex flex-col items-end gap-2 md:top-3 md:right-3 md:flex-row md:items-center">
          <Link href="#" key={event.id}>
            <ActionButton2
              className="flex h-8 items-center rounded-full capitalize md:text-base"
              variant="outline"
            >
              <div className="mr-1.5 size-1.5 animate-pulse rounded-full bg-green-700 md:mr-3 md:size-2" />
              <span>Active</span>
            </ActionButton2>
          </Link>
          <ActionButton2
            variant="outline"
            size="icon-xs"
            className="aspect-square rounded-full"
          >
            <Bookmark className="size-4.5 md:size-5.5" />
          </ActionButton2>{" "}
          <ActionButton2
            variant="outline"
            size="icon-xs"
            className="aspect-square rounded-full"
          >
            <Share2 className="size-4 md:size-4.5" />
          </ActionButton2>
        </div>
      </section>

      <Container className="grid grid-cols-1 gap-20 md:grid-cols-[1fr_0.55fr]">
        <div className="space-y-20">
          <section className="flex flex-col gap-5">
            <h1 className="text-xl font-semibold md:text-3xl">{event.name}</h1>

            {/* =========================== About Event =========================== */}

            <ReadMore
              text={event.description}
              lines={5}
              className="text-muted-foreground line-clamp-4 text-sm font-light whitespace-pre-line md:text-base"
            />

            {/* =========================== Event Details =========================== */}
            <div className="block md:hidden">
              <EventDetailBox
                startAt={event.startAt}
                endAt={event.endAt}
                venue={event.venue}
                categories={event.categories}
                lowestTicketPrice={lowestTicketPrice}
              />
            </div>
          </section>

          {/* =========================== Artist Lineup =========================== */}
          <section className="w-full space-y-5 md:space-y-8">
            <h1 className="text-2xl font-semibold md:text-3xl">
              Artist Lineup
            </h1>
            <div className="flex origin-left gap-5 overflow-x-auto scroll-smooth">
              <ArtistSpotlight performers={event.performers} />
            </div>
          </section>

          {/* =========================== Event Gallery =========================== */}
          <section className="w-full space-y-5 md:space-y-8">
            <h1 className="text-2xl font-semibold md:text-3xl">
              Event Gallery
            </h1>
            <AutoImageGrid images={event.images.map((image) => image.url)} />
          </section>
        </div>

        <div className="top-5 hidden h-fit md:sticky md:block">
          <section className="flex flex-col gap-5">
            {/* =========================== Tickets Sold =========================== */}
            <div className="bg-muted-foreground/10 flex flex-col items-end justify-end gap-1 rounded-lg p-5 md:rounded-xl lg:rounded-2xl">
              <p className="text-muted-foreground text-sm font-light md:text-base">
                Tickets Sold
              </p>
              <h1 className="text-2xl font-semibold md:text-3xl">
                21,000 / 30,000
              </h1>
            </div>

            {/* =========================== Event Details =========================== */}
            <EventDetailBox
              startAt={event.startAt}
              endAt={event.endAt}
              venue={event.venue}
              categories={event.categories}
              lowestTicketPrice={lowestTicketPrice}
            />
          </section>
        </div>
      </Container>
    </div>
  );
}
