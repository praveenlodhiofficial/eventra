import Image from "next/image";

import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { getPerformerAction } from "@/domains/performer/performer.actions";

export default async function PerformerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await getPerformerAction(id);

  if (!res.success) {
    return <div>Error fetching performer</div>;
  }

  const performer = res.data;

  if (!performer) {
    return <div>Performer not found</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_0.65fr] md:gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-semibold md:text-3xl">
            {performer.name}
          </h1>
          <PerformerModal type="update" performer={performer} />
        </div>
        <p className="text-muted-foreground text-sm font-light text-balance md:text-base">
          {performer.bio}
        </p>
      </div>
      <div className="relative order-first aspect-square w-full overflow-hidden rounded-xl md:order-last md:aspect-9/12 md:rounded-2xl lg:rounded-3xl">
        <Image
          src={performer.image}
          alt={performer.name}
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
