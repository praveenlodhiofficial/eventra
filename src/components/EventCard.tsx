import Link from "next/link";

import { Image } from "@imagekit/next";
import { format, isSameDay } from "date-fns";

import { config } from "@/lib/config";

type Props = {
  event: {
    id: string;
    name: string;
    slug: string;
    coverImage: string;
    startAt: Date;
    endAt: Date;
    venue?: { name?: string | null; state?: string | null } | null;
    ticketTypes?: { price: number | string | null }[];
  };
};

export function EventCard({ event }: Props) {
  const hasVenueName = event.venue?.name && event.venue.name.trim().length > 0;
  const hasVenueState =
    event.venue?.state && event.venue.state.trim().length > 0;

  const venueText =
    hasVenueName && hasVenueState
      ? `${event.venue!.name}, ${event.venue!.state}`
      : "Venue to be announced";

  const prices = (event.ticketTypes ?? [])
    .map((t) => (t?.price != null ? Number(t.price) : NaN))
    .filter((n) => Number.isFinite(n) && n > 0) as number[];

  const lowestPrice = prices.length ? Math.min(...prices) : null;

  const priceFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  const priceText = lowestPrice
    ? `₹ ${priceFormatter.format(lowestPrice)} onwards`
    : "Tickets to be announced";

  return (
    <Link
      href={`/events/${event.slug}`}
      className="overflow-hidden rounded-3xl border lg:h-120"
    >
      {/* image */}
      <div className="relative aspect-10/11 w-full">
        <Image
          urlEndpoint={config.imagekit.url_endpoint}
          src={event.coverImage}
          alt={event.name}
          fill
          transformation={[{ width: 400, height: 400 }]}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="space-y-1.5 p-3">
        {/* date */}
        <div className="text-xs text-amber-600">
          {isSameDay(event.startAt, event.endAt) ? (
            <>
              {format(event.startAt, "MMM dd, yyyy")},{" "}
              {format(event.startAt, "p")}
            </>
          ) : (
            <>
              {format(event.startAt, "MMM dd")} —{" "}
              {format(event.endAt, "MMM dd")}
            </>
          )}
        </div>

        {/* title */}
        <div className="line-clamp-2 text-[14px] font-semibold md:text-[16px]">
          {event.name}
        </div>

        {/* venue */}
        <div className="text-muted-foreground text-xs">{venueText}</div>

        <div className="text-muted-foreground text-xs">{priceText}</div>
      </div>
    </Link>
  );
}
