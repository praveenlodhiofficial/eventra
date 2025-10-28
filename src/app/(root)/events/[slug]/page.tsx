import EventGradientBackground from "@/components/EventGradientBackground";
import ExpandableText from "@/components/ExpandableText";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/features/event";
import { TicketType } from "@/generated/prisma";
import { formatDate } from "@/lib/utils";
import { CalendarIcon, MapIcon, MapPinIcon } from "lucide-react";
import Image from "next/image";

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
   const { event, success, message } = await getEvent(slug);

   if (!success) return <div>{message}</div>;

   return (
      <EventGradientBackground coverImageUrl={event?.coverImageUrl || undefined}>
         <div className="z-10 grid grid-cols-1 gap-5 rounded-2xl p-3 text-[15px] md:p-5 lg:grid-cols-[1.8fr_1fr] lg:gap-10 lg:p-10">
            {/* Left Side - Event Info */}
            <div className="z-10 space-y-5 overflow-hidden rounded-2xl md:space-y-10">
               <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_auto] lg:gap-0">
                  {event?.coverImageUrl && (
                     <Image
                        src={event.coverImageUrl}
                        alt={event?.name || "Event Cover"}
                        width={1000}
                        height={1000}
                        className="aspect-video w-full rounded-lg object-cover md:rounded-2xl"
                     />
                  )}

                  {/* Mobile View - Event Info - Large Screen Hidden */}
                  <div className="h-fit space-y-2 overflow-hidden rounded-lg border bg-white p-3 md:max-w-[38vw] md:space-y-3 md:rounded-2xl md:p-4 lg:hidden lg:space-y-4">
                     {event?.name && (
                        <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">
                           {event.name}
                        </h1>
                     )}

                     <div className="space-y-1 md:space-y-2 lg:space-y-3">
                        {event?.location && (
                           <div className="flex items-center gap-1.5">
                              <MapPinIcon className="size-3 md:size-3.5 lg:size-4.5" />
                              <p className="text-[13px] md:text-sm lg:text-base">
                                 {event.location}
                              </p>
                           </div>
                        )}
                        {event?.startDate && (
                           <div className="flex items-center gap-1.5">
                              <CalendarIcon className="size-3 md:size-3.5 lg:size-4.5" />
                              <p className="text-[13px] md:text-sm lg:text-base">
                                 {formatDate(event.startDate)}
                              </p>
                           </div>
                        )}
                     </div>
                     <Separator />

                     <div className="flex items-center justify-between gap-5">
                        <div>
                           <span className="text-[11px] capitalize md:text-xs">starts from</span>
                           <p className="relative bottom-1 text-lg font-semibold md:text-xl lg:text-2xl">
                              {event?.ticketType === TicketType.FREE ? "Free" : "₹ 3,000"}
                           </p>
                        </div>
                        <div className="font-exo2 flex h-8 cursor-pointer items-center gap-2 rounded-sm border bg-gray-100 px-3 py-1 text-base font-bold tracking-tight uppercase invert md:h-11 md:rounded-md lg:px-2 lg:text-xl">
                           Book tickets
                        </div>
                     </div>
                  </div>
               </div>

               {event?.description && (
                  <div className="space-y-2 md:space-y-3">
                     <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">
                        About the event
                     </h1>
                     <ExpandableText
                        text={event.description}
                        maxLines={5}
                        className="text-[13px] md:text-sm lg:text-base"
                     />
                  </div>
               )}

               {event?.location && (
                  <div className="space-y-2 md:space-y-3">
                     <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">Venue</h1>
                     <div className="grid grid-cols-1 items-center gap-1 rounded-lg border bg-white p-3 pl-4 whitespace-pre-wrap md:grid-cols-[1fr_auto]">
                        <p className="text-[13px] md:text-sm lg:text-base">{event.location}</p>
                        <div className="font-exo2 flex w-fit cursor-pointer items-center justify-center gap-2 rounded-sm border bg-gray-100 px-3 py-1 font-bold uppercase md:w-full">
                           <MapIcon className="size-3 md:size-3.5 lg:size-4.5" />
                           <span className="text-[13px] md:text-sm lg:text-base">
                              Get directions
                           </span>
                        </div>
                     </div>
                  </div>
               )}

               {event?.imageUrl && event.imageUrl.length > 0 && (
                  <div className="space-y-2 md:space-y-3">
                     <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">Gallery</h1>
                     <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-5 lg:gap-5">
                        {event.imageUrl.map((image) => (
                           <Image
                              key={image}
                              src={image}
                              alt={event?.name || "Event Image"}
                              width={500}
                              height={500}
                              className="aspect-video rounded-lg object-cover md:rounded-2xl lg:aspect-square"
                           />
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* Right Side - Ticket and Details - Large Screen Hidden - */}
            <div className="sticky top-26 hidden h-fit space-y-4 overflow-hidden rounded-2xl border bg-white p-4 lg:block">
               {event?.name && <h1 className="text-2xl font-semibold">{event.name}</h1>}

               <div className="space-y-3">
                  {event?.location && (
                     <div className="flex items-center gap-1.5">
                        <MapPinIcon className="size-4.5" />
                        <p>{event.location}</p>
                     </div>
                  )}
                  {event?.startDate && (
                     <div className="flex items-center gap-1.5">
                        <CalendarIcon className="size-4.5" />
                        <p>{formatDate(event.startDate)}</p>
                     </div>
                  )}
               </div>
               <Separator />

               <div className="flex items-center justify-between gap-5">
                  <div>
                     <span className="text-xs capitalize">starts from</span>
                     <p className="relative bottom-1 text-xl font-semibold">
                        {event?.ticketType === TicketType.FREE ? "Free" : "₹ 3,000"}
                     </p>
                  </div>
                  <div className="font-exo2 flex h-11 cursor-pointer items-center gap-2 rounded-sm border bg-gray-100 px-3 py-1 text-xl font-bold tracking-tight uppercase invert">
                     Book tickets
                  </div>
               </div>
            </div>
         </div>
      </EventGradientBackground>
   );
}
