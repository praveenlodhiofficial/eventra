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
  startAt: Date | null;
  endAt: Date | null;
  venue: Venue | null;
  categories: EventCategory[];
  lowestTicketPrice: number | null;
  ticketsToBeAnnounced?: boolean;
  slug: string;
  cityToBeAnnounced?: boolean;
  venueToBeAnnounced?: boolean;
  scheduleToBeAnnounced?: boolean;
};

export function EventDetailBox({
  startAt,
  endAt,
  venue,
  categories,
  lowestTicketPrice,
  ticketsToBeAnnounced,
  slug,
  cityToBeAnnounced,
  venueToBeAnnounced,
  scheduleToBeAnnounced,
}: Props) {
  const priceFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  const hasSchedule =
    startAt instanceof Date &&
    endAt instanceof Date &&
    !Number.isNaN(startAt.getTime()) &&
    !Number.isNaN(endAt.getTime());

  const formattedStartDate = hasSchedule
    ? formatDate(startAt!, "MMM dd, yyyy")
    : null;
  const formattedEndDate = hasSchedule
    ? formatDate(endAt!, "MMM dd, yyyy")
    : null;

  const showTbaSchedule = Boolean(scheduleToBeAnnounced) || !hasSchedule;
  const showTbaVenue = Boolean(venueToBeAnnounced) || !venue;
  const showTbaCity = Boolean(cityToBeAnnounced);

  return (
    <div className="bg-muted-foreground/10 flex flex-col gap-3 rounded-lg p-5 md:rounded-xl lg:rounded-2xl">
      <section className="flex flex-col gap-3">
        {/* Event Date & Time =========================== */}
        <div className="flex items-center gap-3">
          <CalendarCheckIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {showTbaSchedule || !formattedStartDate || !formattedEndDate ? (
              <>To be announced</>
            ) : isSameDay(startAt!, endAt!) ? (
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
            {showTbaVenue ? (
              <>To be announced</>
            ) : (
              <>
                {venue!.name},{" "}
                <span>
                  {showTbaCity ? "" : venue!.city + ", "}
                  {venue!.state}
                </span>
              </>
            )}
          </span>
        </div>

        {/* Event Time =========================== */}
        <div className="flex items-center gap-3">
          <ClockIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {showTbaSchedule ? (
              <>To be announced</>
            ) : (
              <>
                {formatDate(startAt!, "p")} - {formatDate(endAt!, "p")}
              </>
            )}
          </span>
        </div>

        {/* Event Category =========================== */}
        <div className="flex items-center gap-3">
          <TagIcon className="size-4.5" strokeWidth={1.5} />
          <span className="text-sm font-light md:text-base">
            {categories?.length
              ? categories.map((category) => category.name).join(", ")
              : "To be announced"}
          </span>
        </div>
      </section>

      <Separator className="border-muted-foreground/20 my-2 border" />

      <section className="flex items-end justify-between gap-5">
        {ticketsToBeAnnounced || !lowestTicketPrice ? (
          <h1 className="border-muted-foreground w-full rounded-lg border border-dashed p-4 text-center text-base font-medium md:text-lg">
            Tickets to be announced
          </h1>
        ) : (
          <>
            <div className="flex flex-col justify-start text-start">
              <p className="text-muted-foreground text-sm font-light md:text-base">
                Starts from
              </p>
              <h1 className="text-start text-2xl font-semibold md:text-3xl">
                ₹&nbsp;{priceFormatter.format(lowestTicketPrice)}
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
          </>
        )}
      </section>
    </div>
  );
}
