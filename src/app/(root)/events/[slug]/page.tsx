import { getEvent } from "@/features/event";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, MapIcon, MapPinIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TicketType } from "@/generated/prisma";
// import { Image } from "@imagekit/next";

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   const { event, success, message } = await getEvent(slug);

   if (!success) return <div>{message}</div>;

   return (
      <div className="grid grid-cols-[1.8fr_1fr] gap-10 rounded-2xl bg-gray-100 p-10 text-[15px]">
         {/* Event Details Section (Left Side) ---------------------------------------------------------------> */}
         <div className="space-y-10 overflow-hidden rounded-2xl">
            {/* Event Cover Image Section ---------------------------------------------------------------> */}
            {event?.coverImageUrl && (
               <Image
                  src={event?.coverImageUrl || ""}
                  alt={event?.name || "Event Cover Image"}
                  width={1000}
                  height={1000}
                  className="aspect-video h-fit w-full rounded-2xl object-cover"
               />
            )}

            {/* Event Description Section ---------------------------------------------------------------> */}
            {event?.description && (
               <div className="space-y-3">
                  <h1 className="text-2xl font-semibold">About the event</h1>
                  <div className="text-justify whitespace-pre-wrap">{event?.description}</div>
               </div>
            )}

            {/* Event Venue Section ---------------------------------------------------------------> */}
            {event?.location && (
               <div className="space-y-3">
                  <h1 className="text-2xl font-semibold">Venue</h1>
                  <div className="grid grid-cols-[1fr_auto] items-center rounded-lg border bg-white p-3 pl-4 text-justify whitespace-pre-wrap">
                     <p>{event?.location}</p>
                     <div className="font-exo2 flex cursor-pointer items-center gap-2 rounded-sm border bg-gray-100 px-3 py-1 font-bold uppercase">
                        <MapIcon className="size-4.5" />
                        Get directions
                     </div>
                  </div>
               </div>
            )}

            {/* Event Gallery Section ---------------------------------------------------------------> */}
            {event?.imageUrl && event?.imageUrl.length > 0 && (
               <div className="space-y-3">
                  <h1 className="text-2xl font-semibold">Gallery</h1>
                  <div className="grid grid-cols-5 gap-5">
                     {event?.imageUrl.map((image) => (
                        <Image
                           key={image}
                           src={image}
                           alt={event?.name || "Event Image"}
                           width={500}
                           height={500}
                           className="aspect-square rounded-2xl object-cover"
                        />
                     ))}
                  </div>
               </div>
            )}
         </div>

         {/* Event Details Section (Right Side) ---------------------------------------------------------------> */}
         <div className="h-fit space-y-4 overflow-hidden rounded-2xl border bg-white p-4">
            {/* Event Name Section ---------------------------------------------------------------> */}
            {event?.name && <h1 className="text-2xl font-semibold">{event?.name}</h1>}

            {/* Event Location and Date Section ---------------------------------------------------------------> */}
            <div className="space-y-3">
               {event?.location && (
                  <div className="flex items-center gap-1.5">
                     <MapPinIcon className="size-4.5" />
                     <p>{event?.location}</p>
                  </div>
               )}
               {event?.startDate && (
                  <div className="flex items-center gap-1.5">
                     <CalendarIcon className="size-4.5" />
                     <p>{formatDate(event?.startDate)}</p>
                  </div>
               )}
            </div>
            <Separator />

            {/* Event Ticket Section ---------------------------------------------------------------> */}
            <div className="flex items-center justify-between gap-5">
               <div>
                  <span className="text-xs capitalize">starts from</span>
                  <p className="relative bottom-1 text-xl font-semibold">
                     {event?.ticketType === TicketType.FREE ? "Free" : `₹ 3,000`}
                  </p>
               </div>
               <div className="font-exo2 flex h-11 cursor-pointer items-center gap-2 rounded-sm border bg-gray-100 px-3 py-1 text-xl font-bold tracking-tight uppercase invert">
                  Book tickets
               </div>
            </div>
         </div>
      </div>
   );
}
