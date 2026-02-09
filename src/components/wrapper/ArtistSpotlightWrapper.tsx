import { findAllPerformers } from "@/domains/performer/performer.dal";

import { ArtistSpotlight } from "../ArtistSpotlight";

export async function ArtistSpotlightWrapper() {
  const performers = await findAllPerformers();

  if (!performers || performers.length === 0) {
    return (
      <div className="bg-muted flex h-[20vh] w-full items-center justify-center rounded-3xl text-xl font-medium lg:h-[30vh]">
        No artists available
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex overflow-x-auto overflow-y-hidden">
      <ArtistSpotlight performers={performers} />
    </div>
  );
}
