import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { Carousel } from "@/components/Carousel";
import { EventCard } from "@/components/EventCard";
import { EventCategories } from "@/components/EventCategories";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="space-y-15">
      {/* =============================== Event Carousel =============================== */}
      <div className="relative w-full">
        <Carousel
          productImageUrls={[
            "https://media.insider.in/image/upload/c_crop,g_custom/v1769515869/hd7c5l5rcq83argtgkfp.jpg",
            "https://media.insider.in/image/upload/c_crop,g_custom/v1768026729/jm3u8hass1nhublfd1gc.jpg",
            "https://media.insider.in/image/upload/c_crop,g_custom/v1770112152/pwtxubhql1vj97okfnhk.jpg",
          ]}
        />
        <div className="absolute top-0 left-0 h-full w-full bg-linear-to-b from-white/0 via-white/5 to-white" />
      </div>

      <Container>
        {/* =============================== Explore Events =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-semibold">Explore Events</h1>
          <div className="flex flex-wrap gap-5">
            <EventCategories />
          </div>
        </section>

        {/* =============================== Artist Spotlight =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-semibold">Artist Spotlight</h1>
          <div className="flex gap-5">
            <ArtistSpotlight />
          </div>
        </section>

        {/* =============================== Popular Events =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-8">
          <h1 className="text-3xl font-semibold">Popular Events</h1>
          <div className="flex gap-5">
            <EventCard />
          </div>
        </section>
      </Container>
    </div>
  );
}
