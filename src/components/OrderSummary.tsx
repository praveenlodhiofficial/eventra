import { BiSolidOffer } from "react-icons/bi";
import { FaCreditCard } from "react-icons/fa6";

import Link from "next/link";

import { ChevronsRightIcon } from "lucide-react";

import { getSession } from "@/domains/auth/auth.actions";
import { findBookingItems } from "@/domains/booking-item/booking-items.dal";
import { findBookingById } from "@/domains/booking/booking.dal";
import { findEvent } from "@/domains/event/event.dal";

import { ActionButton1 } from "./ui/action-button";
import { Separator } from "./ui/separator";

export default async function OrderSummary({
  bookingId,
}: {
  bookingId: string;
}) {
  // ================================ SESSION CHECK ================================
  const session = await getSession();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Please sign in to continue
        </h1>
      </div>
    );
  }

  const userId = session.userId;

  // ================================ BOOKING CHECK ================================
  const booking = await findBookingById(bookingId);
  if (!booking || booking.userId !== userId) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Booking not found
        </h1>
      </div>
    );
  }

  // ================================ BOOKING ITEMS CHECK ================================
  const bookingItems = await findBookingItems(bookingId);
  if (!bookingItems || bookingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Booking items not found
        </h1>
      </div>
    );
  }

  // ================================ EVENT CHECK ================================
  const event = await findEvent({ id: booking.eventId });
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold md:text-3xl">Event not found</h1>
      </div>
    );
  }

  const eventName = event.name;
  const totalAmount = Number(booking.totalAmount);

  // ============================== CALCULATE BOOKING FEE ================================
  const bookingFee = totalAmount * 0.118; // 11.8% GST

  return (
    <div className="mx-3 mt-5 max-w-2xl space-y-10 rounded-xl bg-white/30 pt-5 pb-1 backdrop-blur-sm md:mx-auto md:mt-10 md:space-y-5 md:rounded-2xl">
      {/* ========================================== TICKET DETAILS ========================================== */}
      <div>
        <p className="from-muted-foreground/10 to-primary/70 bg-linear-to-l p-1 px-6 text-sm font-medium text-white uppercase">
          Ticket Details
        </p>
        <div className="relative m-3 rounded-xl md:m-5">
          <h1 className="my-5 line-clamp-2 px-5 text-base font-medium md:text-lg">
            {eventName}
          </h1>

          {bookingItems.map((item) => (
            <div
              key={item.id}
              className="border-muted-foreground/20 flex items-end justify-between border-t px-5 py-3"
            >
              <div className="space-y-1">
                <h3 className="text-muted-foreground text-sm font-light">
                  {item.ticketType.name}
                </h3>
                {/* Quantity */}
                <h3 className="flex gap-1 font-medium">
                  {item.quantity} Tickets
                </h3>
              </div>
              <h1 className="text-base font-medium md:text-lg">
                ₹{Number(item.price)}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================== OFFER DETAILS ========================================== */}
      <div>
        <p className="from-muted-foreground/10 to-primary/70 bg-linear-to-l p-1 px-6 text-sm font-medium text-white uppercase">
          Offer
        </p>
        <div className="relative m-3 overflow-hidden rounded-xl md:m-5">
          <ActionButton1
            variant="ghost"
            className="flex w-full justify-between rounded-none py-7"
            icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
          >
            <BiSolidOffer className="mr-3 size-4.5 md:size-5" />
            <span className="text-base font-normal capitalize">
              View All Event Offers
            </span>
          </ActionButton1>
          <Separator className="bg-muted-foreground/20" />
          <ActionButton1
            variant="ghost"
            className="flex w-full justify-between rounded-none py-7"
            icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
          >
            <FaCreditCard className="mr-3 size-4 md:size-4.5" />
            <span className="text-base font-normal capitalize">
              View All Payment Offers
            </span>
          </ActionButton1>
        </div>
      </div>

      {/* ========================================== PAYMENT DETAILS ========================================== */}
      <div>
        <p className="from-muted-foreground/10 to-primary/70 bg-linear-to-l p-1 px-6 text-sm font-medium text-white uppercase">
          Payment Details
        </p>
        <div className="relative m-3 space-y-3 rounded-xl px-3 py-3 md:m-5 md:px-5 md:py-5">
          <div className="flex items-center justify-between font-semibold">
            <p>Order Amount</p>
            <p>₹{totalAmount}</p>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-[15px] font-light">
            <p>Booking Fee (incl. GST)</p>
            <p>₹{bookingFee.toFixed(2)}</p>
          </div>
          <Separator className="bg-muted-foreground/20 my-3" />
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold md:text-xl">Grand Total</p>
            <p className="text-lg font-semibold md:text-xl">
              ₹{(totalAmount + bookingFee).toFixed(2)}
            </p>
          </div>
        </div>
        {/* 
        <div className="m-3 md:m-5">
          <Link href="/events/buy/checkout/billing" className="w-full">
            <ActionButton2 className="w-full cursor-pointer rounded-xl py-7 text-sm">
              Continue to Billing Details
            </ActionButton2>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
