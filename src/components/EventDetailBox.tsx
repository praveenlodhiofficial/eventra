import Link from "next/link";

import { formatDate } from "date-fns";
import { isSameDay } from "date-fns";
import {
  ArrowUpRight,
  CalendarCheckIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react";

import { Venue } from "@/generated/prisma/client";
import { EventCategory } from "@/generated/prisma/client";

import { ActionButton1 } from "./ui/action-button";
import { Separator } from "./ui/separator";

type Props = {
  startAt: Date;
  endAt: Date;
  venue: Venue;
  categories: EventCategory[];
  lowestTicketPrice: number;
  slug: string;
};

export function EventDetailBox({
  startAt,
  endAt,
  venue,
  categories,
  lowestTicketPrice,
  slug,
}: Props) {
  if (
    !startAt ||
    !endAt ||
    !venue ||
    !categories ||
    !lowestTicketPrice ||
    !slug
  ) {
    return null;
  }
  const formattedStartDate = formatDate(startAt, "MMM dd, yyyy");
  const formattedEndDate = formatDate(endAt, "MMM dd, yyyy");

  return (
    <div className="bg-muted-foreground/10 flex flex-col gap-3 rounded-lg p-5 md:rounded-xl lg:rounded-2xl">
      <section className="flex flex-col gap-3">
        {/* Event Date & Time =========================== */}
        <div className="flex items-center gap-3">
          <CalendarCheckIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {isSameDay(startAt, endAt) ? (
              <>{formattedStartDate}</>
            ) : (
              <>
                {formattedStartDate} - {formattedEndDate}
              </>
            )}
          </span>
        </div>

        {/* Event Location =========================== */}
        <div className="flex items-center gap-3">
          <MapPinIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {venue.name}, {venue.state}
          </span>
        </div>

        {/* Event Time =========================== */}
        <div className="flex items-center gap-3">
          <ClockIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {formatDate(startAt, "p")} - {formatDate(endAt, "p")}
          </span>
        </div>

        {/* Event Category =========================== */}
        <div className="flex items-center gap-3">
          <TagIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {categories.map((category) => category.name).join(", ")}
          </span>
        </div>
      </section>

      <Separator className="border-muted-foreground/20 my-2 border" />

      <section className="flex items-center justify-between gap-5">
        <div className="flex flex-col justify-start text-start">
          <p className="text-muted-foreground text-sm font-light md:text-base">
            Starts From
          </p>
          <h1 className="text-start text-2xl font-semibold md:text-3xl">
            ₹&nbsp;{lowestTicketPrice}
          </h1>
        </div>
        <Link href={`/events/${slug}/buy-page`}>
          <ActionButton1
            size="lg"
            className="flex cursor-pointer items-center justify-center py-6.5 text-center md:py-7"
            icon={<ArrowUpRight className="size-5" strokeWidth={1.5} />}
          >
            <span className="text-base font-medium">Book Tickets</span>
          </ActionButton1>
        </Link>
      </section>
    </div>
  );
}
