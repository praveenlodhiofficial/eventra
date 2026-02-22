import { notFound } from "next/navigation";

import { Image } from "@imagekit/next";

import { Container } from "@/components/ui/container";
import { EventsWrapper } from "@/components/wrapper/EventsWrapper";
import { findPerformer } from "@/domains/performer/performer.dal";
import { config } from "@/lib/config";

export default async function ArtistPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const performer = await findPerformer({ slug });

  if (!performer) {
    return notFound();
  }

  return (
    <Container className="">
      {/* =========================== Artist Image + Name + Bio =========================== */}
      <div className="grid max-h-[70vh] grid-cols-[0.8fr_1fr] gap-5 md:gap-10">
        <section className="relative aspect-square max-h-full w-full overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl">
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={performer.image}
            alt={performer.name}
            fill
            className="w-full object-cover"
            transformation={[{ width: 2000, height: 2000 }]}
          />
        </section>
        <section className="space-y-5">
          <h1 className="text-2xl font-semibold md:text-3xl">
            {performer.name}
          </h1>
          <p className="text-muted-foreground text-sm font-light whitespace-pre-line md:text-base">
            {performer.bio}
          </p>
        </section>
      </div>

      {/* <Separator/> */}

      <section className="w-full max-w-7xl space-y-5 md:space-y-8">
        <EventsWrapper
          title={`All Events by ${performer.name}`}
          performerId={performer.id}
        />
      </section>
    </Container>
  );
}
