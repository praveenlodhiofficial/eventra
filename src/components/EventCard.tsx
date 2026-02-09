import Link from "next/link";

import { Image } from "@imagekit/next";
import { format, isSameDay } from "date-fns";

import { findEvents } from "@/domains/event/event.dal";
import { config } from "@/lib/config";

export async function EventCard() {
  const events = await findEvents({
    status: "PUBLISHED",
  });

  if (!events || events.length === 0) {
    return (
      <div className="bg-muted flex h-[20vh] w-full items-center justify-center rounded-3xl text-xl font-medium lg:h-[30vh]">
        No events found
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
      {events.map((event) => {
        return (
          <Link
            href={`/events/${event.slug}`}
            key={event.id}
            className="h-fit overflow-hidden rounded-3xl border lg:h-[65vh]"
          >
            <div className="relative aspect-10/11 h-[73%] w-full">
              <Image
                urlEndpoint={config.imagekit.url_endpoint}
                src={event.coverImage}
                alt={event.name}
                fill
                transformation={[{ width: 400, height: 400 }]}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="h-fit w-full space-y-1.5 p-3">
              {/* =========================== Event Date & Time =========================== */}
              <div className="line-clamp-1 text-xs text-amber-600 md:line-clamp-none md:text-[13px]">
                {isSameDay(event.startAt, event.endAt) ? (
                  <>
                    {format(event.startAt, "MMM dd, yyyy")},{" "}
                    {format(event.startAt, "p")}
                  </>
                ) : (
                  <>
                    {format(event.startAt, "MMM dd, yyyy")} -{" "}
                    {format(event.endAt, "MMM dd, yyyy")},{" "}
                    {format(event.startAt, "p")}
                  </>
                )}
              </div>

              {/* =========================== Event Title =========================== */}
              <div className="line-clamp-2 text-[14px] leading-snug font-semibold md:text-[16px]">
                {event.name}
              </div>

              <div className="space-y-1 md:space-y-0.5">
                {/* =========================== Event Location =========================== */}
                <div className="text-muted-foreground line-clamp-1 text-xs">
                  {event.venue.name}, {event.venue.state}
                </div>

                {/* =========================== Event Price =========================== */}
                <div className="text-muted-foreground text-xs md:text-[13px]">
                  ₹{Number(event.price).toFixed(2)} onwards
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
