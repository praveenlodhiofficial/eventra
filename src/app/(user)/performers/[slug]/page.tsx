import { Image } from "@imagekit/next";
import { ArrowUpRight, Calendar, Music, Share2, Sparkles } from "lucide-react";

import { EventCard } from "@/components/EventCard";
import { PerformerCard } from "@/components/PerformerCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReadMore } from "@/components/ui/read-more";
import { findPerformerWithEvents } from "@/domains/performer/performer.dal";
import { findPerformersByRole } from "@/domains/performer/performer.dal";
import { config } from "@/lib/config";

export default async function PerformerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const performer = await findPerformerWithEvents({ slug });

  if (!performer) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Performer not found
      </div>
    );
  }

  const upcomingEvents = performer.events.filter(
    (e) => e.startAt && new Date(e.startAt) > new Date()
  );
  const pastEvents = performer.events.filter(
    (e) => e.startAt && new Date(e.startAt) <= new Date()
  );

  // Get similar performers by role (excluding current performer)
  const similarPerformers = await findPerformersByRole(performer.role);
  const filteredSimilarPerformers = similarPerformers
    .filter((p) => p.id !== performer.id)
    .slice(0, 4);

  return (
    <div className="space-y-5">
      {/* ======================= HERO SECTION ======================= */}
      <section className="relative overflow-hidden">
        {/* ======================= BACKGROUND IMAGE ======================= */}
        <div className="absolute inset-0 h-96 overflow-hidden md:h-125">
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={performer.image}
            alt={performer.name}
            fill
            priority
            transformation={[{ width: 1400, height: 500, quality: 60 }]}
            className="h-full w-full origin-top object-cover"
          />
          {/* ======================= GRADIENT OVERLAYS ======================= */}
          <div className="from-background via-background/50 absolute inset-0 bg-linear-to-t to-transparent" />
          <div className="from-background/80 absolute inset-0 bg-linear-to-r to-transparent" />
        </div>

        {/* ======================= HERO CONTENT ======================= */}
        <div className="relative z-10 pt-50">
          <div className="flex items-end gap-3 p-3 md:items-end md:gap-8 md:p-5">
            {/* ======================= PROFILE IMAGE ======================= */}
            <div className="group relative">
              {/* Glow effect */}
              <div className="from-primary/30 via-primary/20 absolute -inset-1 rounded-3xl bg-linear-to-r to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Profile Image */}
              <div className="group-hover:ring-primary/40 relative h-25 w-25 overflow-hidden rounded-3xl shadow-2xl ring-2 ring-white/20 transition-all duration-300 md:h-56 md:w-56">
                <Image
                  urlEndpoint={config.imagekit.url_endpoint}
                  src={performer.image}
                  alt={performer.name}
                  fill
                  priority
                  transformation={[{ width: 400, height: 400, quality: 95 }]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>

            {/* ======================= PERFORMER INFO ======================= */}
            <div className="order-1 flex flex-col gap-3 md:order-2 md:pb-4">
              <div className="flex flex-col gap-1 md:gap-2">
                <h1 className="from-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-2xl font-bold text-transparent md:text-5xl">
                  {performer.name}
                </h1>
                <div className="items-center gap-3 md:flex">
                  <p className="text-muted-foreground text-base capitalize">
                    {performer.role}
                  </p>
                  <span className="text-muted-foreground hidden text-base md:block">
                    •
                  </span>
                  <span className="text-muted-foreground text-base">
                    {upcomingEvents.length} upcoming
                  </span>
                </div>
              </div>

              {/* ======================= ACTION BUTTONS ======================= */}
              <div className="hidden flex-wrap gap-3 md:flex">
                <Button className="gap-2 rounded-full" size="xl">
                  <span>Follow</span>
                  <ArrowUpRight className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="gap-2 rounded-full"
                >
                  <Share2 className="size-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= MAIN CONTENT ======================= */}
      <div className="grid grid-cols-1 gap-5 px-3 md:grid-cols-[2fr_1fr] md:gap-20 md:px-5">
        <section className="order-2 space-y-10 md:order-1">
          {/* ======================= ABOUT SECTION ======================= */}
          {performer.bio && (
            <ReadMore
              text={performer.bio}
              lines={4}
              className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line md:text-base"
            />
          )}

          {/* ======================= EVENTS SECTIONS ======================= */}
          {performer.events.length > 0 ? (
            <div className="space-y-12">
              {/* ======================= UPCOMING EVENTS ======================= */}
              {upcomingEvents.length > 0 && (
                <section className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Calendar className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          Upcoming Events
                        </h2>
                        <p className="text-muted-foreground text-xs">
                          {upcomingEvents.length} event
                          {upcomingEvents.length !== 1 ? "s" : ""} coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={{
                          id: event.id,
                          name: event.name,
                          slug: event.slug,
                          coverImage: event.coverImage,
                          startAt: event.startAt,
                          endAt: event.endAt,
                          venue: event.venue,
                          ticketTypes: event.ticketTypes.map((ticketType) => ({
                            price: ticketType.price.toString(),
                          })),
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ======================= PAST EVENTS ======================= */}
              {pastEvents.length > 0 && (
                <section className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted rounded-lg p-2">
                        <Music className="text-muted-foreground h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          Past Events
                        </h2>
                        <p className="text-muted-foreground text-xs">
                          {pastEvents.length} event
                          {pastEvents.length !== 1 ? "s" : ""} completed
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
                    {pastEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={{
                          id: event.id,
                          name: event.name,
                          slug: event.slug,
                          coverImage: event.coverImage,
                          startAt: event.startAt,
                          endAt: event.endAt,
                          venue: event.venue,
                          ticketTypes: event.ticketTypes.map((ticketType) => ({
                            price: ticketType.price.toString(),
                          })),
                        }}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            /* ======================= EMPTY STATE ======================= */
            <div className="border-border from-primary/5 rounded-2xl border border-dashed bg-linear-to-br to-transparent p-12 text-center sm:p-16">
              <div className="bg-primary/10 mx-auto mb-4 inline-flex rounded-full p-4">
                <Calendar className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-foreground text-lg font-semibold">
                No events yet
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Check back soon for upcoming events from {performer.name}
              </p>
            </div>
          )}

          {/* ======================= SIMILAR PERFORMERS ======================= */}
          {filteredSimilarPerformers.length > 0 && (
            <section className="border-border space-y-6 border-t pt-12">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <Sparkles className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Similar Performers
                    </h2>
                    <p className="text-muted-foreground text-xs">
                      Other {performer.role}s you might like
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {filteredSimilarPerformers.map((p) => (
                  <PerformerCard
                    key={p.id}
                    performer={{
                      id: p.id,
                      name: p.name,
                      slug: p.slug,
                      image: p.image,
                      role: p.role,
                    }}
                  />
                ))}
              </div>
            </section>
          )}
        </section>

        {/* ======================= STATS SIDEBAR ======================= */}
        <section className="md:grid-col-1 order-1 grid h-fit grid-cols-2 gap-3 md:order-2">
          {/* ======================= TOTAL EVENTS CARD ======================= */}
          <Card className="h-fit w-full py-3 md:py-6">
            <div className="items-center justify-center space-y-1">
              <p className="text-muted-foreground text-center text-xs font-semibold tracking-widest uppercase md:text-sm">
                Total Events
              </p>
              <p className="text-center text-2xl font-bold tracking-tight md:text-4xl">
                {String(performer.events.length).padStart(2, "0")}
              </p>
            </div>
          </Card>

          {/* ======================= UPCOMING EVENTS CARD ======================= */}
          <Card className="h-fit w-full border-blue-200 py-3 md:py-6 dark:border-blue-800/50">
            <div className="center items-center justify-center space-y-1">
              <p className="text-muted-foreground text-center text-xs font-semibold tracking-widest uppercase md:text-sm">
                Upcoming
              </p>
              <p className="text-center text-2xl font-bold tracking-tight text-blue-600 md:text-4xl dark:text-blue-400">
                {String(upcomingEvents.length).padStart(2, "0")}
              </p>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
