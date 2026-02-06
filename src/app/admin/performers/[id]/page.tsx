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
    <div className="grid grid-cols-[1fr_0.65fr] gap-10">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-semibold">{performer.name}</h1>
          <PerformerModal type="update" performer={performer} />
        </div>
        <p className="text-muted-foreground font-light text-balance">
          {performer.bio}
        </p>
      </div>
      <div className="relative aspect-9/12 w-full overflow-hidden rounded-3xl">
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
