import Link from "next/link";

import { Image } from "@imagekit/next";
import { formatDate, isSameDay } from "date-fns";
import { Bookmark, CalendarCheckIcon, MapPinIcon, Share2 } from "lucide-react";

import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { AutoImageGrid } from "@/components/AutoImageGrid";
import { ActionButton2 } from "@/components/ui/action-button";
import { Badge } from "@/components/ui/badge";
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
                className="h-8 rounded-full capitalize md:text-lg"
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
              className="flex h-8 items-center rounded-full capitalize md:text-lg"
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

      <Container>
        <section className="flex flex-col gap-5">
          <h1 className="text-xl font-semibold md:text-3xl lg:max-w-3/5">
            {event.name}
          </h1>

          <div className="flex flex-col gap-2">
            {/* =========================== Event Date & Time =========================== */}
            <div className="flex items-center justify-start gap-2">
              <CalendarCheckIcon className="text-muted-foreground size-4.5" />
              <span className="text-muted-foreground text-sm font-light md:text-lg">
                {isSameDay(event.startAt, event.endAt) ? (
                  <>
                    {formatDate(event.startAt, "MMM dd, yyyy")},{" "}
                    {formatDate(event.startAt, "p")}
                  </>
                ) : (
                  <>
                    {formatDate(event.startAt, "MMM dd, yyyy")} -{" "}
                    {formatDate(event.endAt, "MMM dd, yyyy")},{" "}
                    {formatDate(event.startAt, "p")}
                  </>
                )}
              </span>
            </div>

            {/* =========================== Event Location =========================== */}
            <div className="flex items-center justify-between gap-2 tracking-wide lg:justify-start">
              <div className="flex items-center gap-2">
                <MapPinIcon className="text-muted-foreground size-4.5" />
                <span className="text-muted-foreground text-sm font-light md:text-lg">
                  {event.venue.name}, {event.venue.state}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="ml-3 px-3 py-1.5 text-xs md:px-4 md:py-1.5 md:text-base"
              >
                Show Map
              </Badge>
            </div>
          </div>

          <Separator className="md:my-5" />

          {/* =========================== About Event =========================== */}
          <h2 className="text-base font-medium capitalize md:text-2xl">
            About Event
          </h2>

          <ReadMore
            text={event.description}
            lines={5}
            className="text-muted-foreground line-clamp-4 w-[60%] text-sm font-light text-balance whitespace-pre-line md:text-lg lg:max-w-4/7"
          />
        </section>

        {/* =========================== Artist Lineup =========================== */}
        <section className="w-full space-y-5 md:space-y-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Artist Lineup</h1>
          <div className="flex origin-left gap-5 overflow-x-auto scroll-smooth">
            <ArtistSpotlight performers={event.performers} />
          </div>
        </section>

        {/* =========================== Event Gallery =========================== */}
        <section className="w-full max-w-4xl space-y-5 md:space-y-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Event Gallery</h1>
          <AutoImageGrid images={event.images.map((image) => image.url)} />
        </section>

        <div className="h-50" />
      </Container>
    </div>
  );
}
