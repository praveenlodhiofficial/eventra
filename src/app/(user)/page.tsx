import { EventCard } from "@/components/EventCard";
import { EventCategories } from "@/components/EventCategories";
import { Container } from "@/components/ui/container";
import { ArtistSpotlightWrapper } from "@/components/wrapper/ArtistSpotlightWrapper";
import { CarouselWrapper } from "@/components/wrapper/CarouselWrapper";

export default async function Home() {
  return (
    <div className="space-y-0 md:space-y-10 lg:space-y-20">
      {/* =============================== Event Carousel =============================== */}
      <div className="relative h-fit w-full lg:h-full">
        <CarouselWrapper />
        {/* <div className="absolute bottom-0 left-0 max-h-[30vh] w-full bg-linear-to-b from-transparent via-white/60 to-white md:h-full" /> */}
      </div>

      <Container>
        {/* =============================== Explore Events =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Explore Events</h1>
          <div className="flex flex-wrap gap-5">
            <EventCategories />
          </div>
        </section>

        {/* =============================== Artist Spotlight =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
          <h1 className="text-2xl font-semibold md:text-3xl">
            Artist Spotlight
          </h1>
          <div className="flex gap-5">
            <ArtistSpotlightWrapper />
          </div>
        </section>

        {/* =============================== Popular Events =============================== */}
        <section className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Popular Events</h1>
          <div className="flex gap-5">
            <EventCard />
          </div>
        </section>
      </Container>
    </div>
  );
}
