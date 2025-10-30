import EventGradientBackground from "@/components/EventGradientBackground";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/features/event/event.action";
import { TicketType } from "@/generated/prisma";
import * as motion from "motion/react-client";

export default async function TicketBookingPage({ params }: { params: { slug: string } }) {
   const { slug } = await params;
   const { event, success, message } = await getEvent(slug);

   if (!success) return <div>{message}</div>;

   return (
      <EventGradientBackground coverImageUrl={event?.coverImageUrl || undefined}>
         <div className="relative my-20 pb-25">
            <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-1">
               {/* ====================================================== Ticket Card ====================================================== */}
               {event?.ticket &&
                  event?.ticket.map((ticket) => (
                     <div
                        key={ticket.id}
                        className="bg-background/40 z-5 w-full max-w-xl scale-90 space-y-3 rounded-2xl border p-5 shadow-lg shadow-black/10 backdrop-blur-2xl"
                     >
                        <h1 className="no-wrap text-xl font-semibold uppercase">
                           Phase 01 | {ticket.category}
                        </h1>
                        <div className="flex flex-col justify-between gap-10 md:flex-row">
                           <span className="text-lg font-semibold md:text-2xl">
                              ₹ {ticket.price}
                           </span>
                           <Button
                              variant="default"
                              className="font-exo2 flex h-10 min-w-33 cursor-pointer items-center gap-2 rounded-sm border px-3 py-1 text-xl font-bold tracking-tight uppercase"
                           >
                              Add
                           </Button>
                        </div>
                        <Separator className="my-4 bg-black/10" />
                        {ticket.guidelines && (
                           <ul className="list-inside list-disc text-sm">
                              {ticket.guidelines.split("\n").map((line, idx) => (
                                 <li key={idx} className="whitespace-pre-wrap">
                                    {line}
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  ))}
            </div>
            {/* ====================================================== Cart Summary ====================================================== */}
            <motion.div
               className="fixed right-0 bottom-0 left-0 z-10 h-fit shadow-md shadow-black backdrop-blur-lg"
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 0 }}
               transition={{ duration: 0.3 }}
            >
               <div className="mx-auto flex h-full max-w-xl scale-90 items-center justify-between px-1 py-3">
                  <div className="flex flex-col">
                     <span className="text-lg font-semibold md:text-2xl">
                        {event?.ticketType === TicketType.FREE
                           ? "Free"
                           : `₹ ${event?.ticket.reduce((acc, ticket) => acc + ticket.price, 0)}`}
                     </span>
                     <span className="ml-0.5 text-sm text-gray-500">1 ticket</span>
                  </div>
                  <Button
                     variant="default"
                     className="font-exo2 flex h-10 cursor-pointer items-center gap-2 rounded-sm border px-3 py-1 text-xl font-bold tracking-tight uppercase"
                  >
                     Add to Cart
                  </Button>
               </div>
            </motion.div>
         </div>
      </EventGradientBackground>
   );
}
