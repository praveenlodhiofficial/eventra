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
} from "lucide-react";
import { TagIcon } from "lucide-react";

import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { AutoImageGrid } from "@/components/AutoImageGrid";
import { ActionButton1, ActionButton2 } from "@/components/ui/action-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
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

  const priceFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  const hasSchedule =
    event.startAt instanceof Date &&
    event.endAt instanceof Date &&
    !Number.isNaN(event.startAt.getTime()) &&
    !Number.isNaN(event.endAt.getTime());

  const formattedStartDate = hasSchedule
    ? formatDate(event.startAt!, "MMM dd, yyyy")
    : null;
  const formattedEndDate = hasSchedule
    ? formatDate(event.endAt!, "MMM dd, yyyy")
    : null;

  const showTbaSchedule = Boolean(event.scheduleToBeAnnounced) || !hasSchedule;
  const showTbaVenue = Boolean(event.venueToBeAnnounced) || !event.venue;
  const showTbaCity = Boolean(event.cityToBeAnnounced);

  return (
    <div>
      <section>
        <div className="relative">
          {/* ======================== Cover Image =========================== */}
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={event.coverImage}
            alt={event.name}
            height={1500}
            width={1500}
            className="aspect-16/10 h-full w-full object-cover md:aspect-16/7"
          />

          {/* =========================== Cover Image Categories =========================== */}
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

          {/* =========================== Cover Image Status =========================== */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-2 md:top-3 md:right-3 md:flex-row md:items-center">
            <Link href="#" key={event.id} className="hidden md:block">
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
        </div>

        <section className="flex w-full max-w-4xl flex-col gap-5 px-3 pt-5 md:px-5 md:pt-10">
          <h1 className="text-xl font-semibold md:text-3xl">{event.name}</h1>

          <ReadMore
            text={event.description}
            lines={5}
            className="text-primary line-clamp-4 max-w-3xl text-sm font-light whitespace-pre-line md:text-base"
          />
        </section>
      </section>

      <Container className="mt-5 grid grid-cols-1 gap-15 md:gap-20 lg:grid-cols-[1fr_0.55fr]">
        <div className="order-2 space-y-15 lg:order-1">
          {/* =========================== Artist Lineup =========================== */}
          {event.performerToBeAnnounced ? (
            <section className="w-full space-y-3 md:space-y-4">
              <h1 className="text-2xl font-semibold md:text-3xl">
                Artist Lineup
              </h1>
              <div className="border-muted-foreground text-muted-foreground flex h-20 w-full items-center justify-center rounded-lg border border-dashed p-4 md:h-30 md:text-lg">
                Performers to be announced.
              </div>
            </section>
          ) : event.performers.length > 0 ? (
            <section className="w-full space-y-5 md:space-y-8">
              <h1 className="text-2xl font-semibold md:text-3xl">
                Artist Lineup
              </h1>
              <div className="flex origin-left gap-5 overflow-x-auto scroll-smooth">
                <ArtistSpotlight performers={event.performers} />
              </div>
            </section>
          ) : null}

          {/* =========================== Event Gallery =========================== */}
          {event.images.length > 0 && (
            <section className="w-full space-y-5 md:space-y-8">
              <h1 className="text-2xl font-semibold md:text-3xl">
                Event Gallery
              </h1>
              <AutoImageGrid images={event.images.map((image) => image.url)} />
            </section>
          )}
        </div>

        <div className="order-1 h-fit md:top-5 lg:sticky lg:order-2">
          <section className="flex flex-col gap-3 md:gap-5">
            {/* =========================== Tickets Sold =========================== */}
            <Card className="bg-muted gap-1 p-3 md:p-4">
              <CardTitle className="text-muted-foreground text-end text-sm font-light md:text-base">
                Tickets Sold
              </CardTitle>
              <CardDescription className="text-primary text-end text-xl font-semibold md:text-3xl lg:text-4xl">
                21,000 / 30,000
              </CardDescription>
            </Card>

            {/* =========================== Event Details =========================== */}
            <Card className="bg-muted gap-3 p-3 md:gap-4 md:p-4">
              {/* =========================== Event Date =========================== */}
              <CardDescription className="text-primary flex items-center gap-3 text-sm font-light md:text-base">
                <CalendarCheckIcon className="size-4.5" strokeWidth={1.5} />

                <span className="leading-none">
                  {showTbaSchedule ||
                  !formattedStartDate ||
                  !formattedEndDate ? (
                    <>To be announced</>
                  ) : isSameDay(event.startAt!, event.endAt!) ? (
                    <>{formattedStartDate}</>
                  ) : (
                    <>
                      {formattedStartDate} - {formattedEndDate}
                    </>
                  )}
                </span>
              </CardDescription>

              {/* =========================== Event Location =========================== */}
              <CardDescription className="text-primary flex items-center gap-3 text-sm font-light md:text-base">
                <MapPinIcon className="size-4.5" strokeWidth={1.5} />

                <span className="leading-none">
                  {showTbaVenue ? (
                    <>To be announced</>
                  ) : (
                    <>
                      {event.venue!.name},{" "}
                      <span>
                        {showTbaCity ? "" : event.venue!.city + ", "}
                        {event.venue!.state}
                      </span>
                    </>
                  )}
                </span>
              </CardDescription>

              {/* =========================== Event Time =========================== */}
              <CardDescription className="text-primary flex items-center gap-3 text-sm font-light md:text-base">
                <ClockIcon className="size-4.5" strokeWidth={1.5} />

                <span className="leading-none">
                  {showTbaSchedule ? (
                    <>To be announced</>
                  ) : (
                    <>
                      {formatDate(event.startAt!, "p")} -{" "}
                      {formatDate(event.endAt!, "p")}
                    </>
                  )}
                </span>
              </CardDescription>

              {/* =========================== Event Category =========================== */}
              <CardDescription className="text-primary flex items-center gap-3 text-sm font-light md:text-base">
                <TagIcon className="size-4.5" strokeWidth={1.5} />

                <span className="leading-none">
                  {event.categories?.length
                    ? event.categories
                        .map((category) => category.name)
                        .join(", ")
                    : "To be announced"}
                </span>
              </CardDescription>

              <Separator />

              <section className="flex items-end justify-between gap-5">
                {!event.ticketTypes?.length ? (
                  <CardTitle className="text-muted-foreground border-muted-foreground w-full rounded-lg border border-dashed p-4 text-center text-base font-medium md:text-lg">
                    Tickets to be announced
                  </CardTitle>
                ) : (
                  <section className="flex w-full items-end justify-between gap-5">
                    <CardContent className="space-y-1 p-0">
                      <CardTitle className="text-muted-foreground text-sm font-light md:text-base">
                        Starts from
                      </CardTitle>
                      <CardDescription className="text-primary text-xl font-semibold md:text-3xl">
                        ₹&nbsp;
                        {priceFormatter.format(
                          Number(event.ticketTypes[0].price)
                        )}
                      </CardDescription>
                    </CardContent>
                    <Link href={`/events/${slug}/buy-page`}>
                      <ActionButton1
                        size="lg"
                        className="flex h-full cursor-pointer items-center justify-center py-3.5 text-center text-sm font-medium md:py-6.5 md:text-base"
                        icon={
                          <ArrowUpRight className="size-5" strokeWidth={1.5} />
                        }
                      >
                        Book Tickets
                      </ActionButton1>
                    </Link>
                  </section>
                )}
              </section>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}
