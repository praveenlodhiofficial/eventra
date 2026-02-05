import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { Carousel } from "@/components/Carousel";
import { EventCard } from "@/components/EventCard";
import { EventCategories } from "@/components/EventCategories";
import { Container } from "@/components/ui/container";

export default function Home() {
  return (
    <div className="space-y-15 md:space-y-20">
      {/* =============================== Event Carousel =============================== */}
      <div className="relative h-fit w-full lg:h-full">
        <Carousel
          productImageUrls={[
            "https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1770204742%2Fugbadsyxmfrd4voxoz91.jpg",
            "https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1769517757%2Fbcki8o6ulghmf7bxt53l.jpg",
            "https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1768801567%2Fjfvotrokpq53xtmryzi8.jpg",
            "https://res.cloudinary.com/dwzmsvp7f/image/upload/f_auto,w_1280/c_crop%2Cg_custom%2Fv1764063100%2Ffksszvjfwmw3gy9ylhib.png",
          ]}
        />
        <div className="absolute top-0 left-0 h-full w-full scale-101 bg-linear-to-b from-transparent via-white/5 to-white md:h-full" />
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
            <ArtistSpotlight />
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
