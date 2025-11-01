import { formatEventDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { getAllEvents } from "@/features/event";

type EventCardProps = {
   event: NonNullable<Awaited<ReturnType<typeof getAllEvents>>["data"]>[0];
};

export default function EventCard({ event }: EventCardProps) {
   return (
      <Link
         href={`/events/${event.slug}`}
         className="overflow-hidden rounded-lg border bg-gray-50 md:rounded-2xl"
      >
         <Image
            src={event.coverImageUrl || ""}
            alt={event.name || "Event Image"}
            width={1000}
            height={1000}
            className="aspect-auto h-[20vh] w-full object-cover md:h-[22vh] lg:h-[50vh]"
         />

         <div className="space-y-0.5 p-2 text-[11px] text-gray-500 md:p-4 md:text-[13px]">
            <p className="text-[#8B8123]">
               {formatEventDateTime(new Date(event.startDate || new Date()))}
            </p>
            <h1 className="line-clamp-2 text-sm font-semibold text-black capitalize md:text-base lg:text-lg">
               {event.name}
            </h1>
            <p className="line-clamp-1">{event.location}</p>
            <p className="line-clamp-1">₹3000 onwards</p>
         </div>
      </Link>
   );
}
