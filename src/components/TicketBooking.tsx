"use client";

import { QuantitySelector } from "@/components/QuantitySelector";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEvent } from "@/features/event/event.action";
import { TicketType } from "@/generated/prisma";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type EventWithTickets = NonNullable<Awaited<ReturnType<typeof getEvent>>["event"]>;

interface TicketBookingProps {
   event: EventWithTickets | null | undefined;
}

export function TicketBooking({ event }: TicketBookingProps) {
   const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
   const [addedTickets, setAddedTickets] = useState<Set<string>>(new Set());

   const handleAddTicket = (ticketId: string) => {
      setAddedTickets((prev) => new Set(prev).add(ticketId));
      setTicketQuantities((prev) => ({
         ...prev,
         [ticketId]: (prev[ticketId] || 0) + 1,
      }));
   };

   const handleDecrease = (ticketId: string) => {
      setTicketQuantities((prev) => {
         const current = prev[ticketId] || 1;
         if (current <= 1) {
            const newQuantities = { ...prev };
            delete newQuantities[ticketId];
            setAddedTickets((prevAdded) => {
               const newAdded = new Set(prevAdded);
               newAdded.delete(ticketId);
               return newAdded;
            });
            return newQuantities;
         }
         return {
            ...prev,
            [ticketId]: current - 1,
         };
      });
   };

   const handleIncrease = (ticketId: string) => {
      setTicketQuantities((prev) => ({
         ...prev,
         [ticketId]: (prev[ticketId] || 1) + 1,
      }));
   };

   const totalPrice = useMemo(() => {
      if (!event) return 0;
      return event.ticket.reduce((acc, ticket) => {
         const quantity = ticketQuantities[ticket.id] || 0;
         return acc + ticket.price * quantity;
      }, 0);
   }, [event, ticketQuantities]);

   const totalTickets = useMemo(() => {
      return Object.values(ticketQuantities).reduce((acc, qty) => acc + qty, 0);
   }, [ticketQuantities]);

   return (
      <div className="relative my-20 pb-25">
         <div className="mx-auto flex h-full w-full flex-col items-center justify-center gap-1">
            {/* ====================================================== Ticket Card ====================================================== */}
            {event?.ticket &&
               event?.ticket.map((ticket) => {
                  const isAdded = addedTickets.has(ticket.id);
                  const quantity = ticketQuantities[ticket.id] || 0;

                  return (
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
                           {!isAdded ? (
                              <Button
                                 variant="default"
                                 onClick={() => handleAddTicket(ticket.id)}
                                 className="font-exo2 flex h-11 min-w-33 cursor-pointer items-center gap-2 rounded-sm border px-3 py-1 text-xl font-bold tracking-tight uppercase"
                              >
                                 Add
                              </Button>
                           ) : (
                              <QuantitySelector
                                 quantity={quantity}
                                 onDecrease={() => handleDecrease(ticket.id)}
                                 onIncrease={() => handleIncrease(ticket.id)}
                              />
                           )}
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
                  );
               })}
         </div>

         {/* ====================================================== Cart Summary ====================================================== */}
         <AnimatePresence>
            {totalTickets > 0 && (
               <motion.div
                  className="fixed right-0 bottom-0 left-0 z-10 h-fit shadow-md shadow-black backdrop-blur-lg"
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 70 }}
                  transition={{ duration: 0.3 }}
               >
                  <div className="mx-auto flex h-full max-w-xl scale-90 items-center justify-between px-1 py-3">
                     <div className="flex flex-col">
                        <span className="text-lg font-semibold md:text-2xl">
                           {event?.ticketType === TicketType.FREE ? "Free" : `₹ ${totalPrice}`}
                        </span>
                        <span className="ml-0.5 text-sm text-gray-500">
                           {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
                        </span>
                     </div>
                     <Button
                        variant="default"
                        className="font-exo2 flex h-11 min-w-33 cursor-pointer items-center gap-2 rounded-sm border px-3 py-1 text-xl font-bold tracking-tight uppercase"
                     >
                        Add to Cart
                     </Button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}
