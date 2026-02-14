import { BiSolidOffer } from "react-icons/bi";
import { FaCreditCard } from "react-icons/fa6";

import Link from "next/link";

import { ChevronsRightIcon } from "lucide-react";

import { ActionButton1, ActionButton2 } from "@/components/ui/action-button";
import { Separator } from "@/components/ui/separator";
import { getSession } from "@/domains/auth/auth.actions";
import { findBookingItems } from "@/domains/booking-item/booking-items.dal";
import { findBookingById } from "@/domains/booking/booking.dal";
import { findEvent } from "@/domains/event/event.dal";

export default async function CheckoutSummaryPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = await params;
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
    <div className="w-full space-y-3 py-5">
      {/* <h1 className="flex flex-col gap-1 text-center uppercase text-lg">Checkout</h1> */}

      {/* ========================================== STEP INDICATOR ========================================== */}
      <div className="bg-muted-foreground/30 sticky top-7 z-10 flex items-center justify-center gap-5 border-y border-dashed border-black p-4 backdrop-blur-xs">
        <div className="flex items-center justify-center gap-1">
          <div className="bg-primary text-primary-foreground aspect-square size-5 rounded-full text-center text-sm">
            1
          </div>
          <span>Order Summary</span>
        </div>
        <ChevronsRightIcon className="size-5" />
        <div className="flex items-center justify-center gap-1">
          <div className="bg-muted-foreground/50 text-muted aspect-square size-5 rounded-full text-center text-sm">
            2
          </div>
          <span className="text-muted-foreground">Billing Details</span>
        </div>
        <ChevronsRightIcon className="text-muted-foreground size-5" />
        <div className="flex items-center justify-center gap-1">
          <div className="bg-muted-foreground/50 text-muted aspect-square size-5 rounded-full text-center text-sm">
            3
          </div>
          <span className="text-muted-foreground">Confirm Order</span>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-5 rounded-2xl border pt-5">
        {/* ========================================== TICKET DETAILS ========================================== */}
        <div>
          <p className="bg-muted-foreground/10 p-1 px-6 text-sm font-medium uppercase">
            Ticket Details
          </p>
          {bookingItems.map((item) => (
            <div
              key={item.id}
              className="relative m-5 space-y-2 rounded-xl border px-5 py-3"
            >
              <h1 className="text-lg font-medium">{eventName}</h1>
              <h3 className="text-muted-foreground text-sm">
                {item.ticketType.name}
              </h3>
              {/* Quantity */}
              <h3 className="flex gap-1 text-sm">
                <span className="font-medium">{item.quantity}</span> Tickets
              </h3>
              <h1 className="absolute right-5 bottom-3 text-2xl font-semibold">
                ₹{Number(item.price)}
              </h1>
            </div>
          ))}
        </div>

        {/* ========================================== OFFER DETAILS ========================================== */}
        <div>
          <p className="bg-muted-foreground/10 p-1 px-6 text-sm font-medium uppercase">
            Offer
          </p>
          <div className="relative m-5 overflow-hidden rounded-xl border">
            <ActionButton1
              variant="ghost"
              className="flex w-full justify-between rounded-none py-7"
              icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
            >
              <BiSolidOffer className="mr-3 size-5" />
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
              <FaCreditCard className="mr-3 size-4.5" />
              <span className="text-base font-normal capitalize">
                View All Payment Offers
              </span>
            </ActionButton1>
          </div>
        </div>

        {/* ========================================== PAYMENT DETAILS ========================================== */}
        <div>
          <p className="bg-muted-foreground/10 p-1 px-6 text-sm font-medium uppercase">
            Payment Details
          </p>
          <div className="relative m-5 space-y-3 rounded-xl border px-5 py-3">
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
              <p className="text-xl font-semibold">Grand Total</p>
              <p className="text-xl font-semibold">
                ₹{(totalAmount + bookingFee).toFixed(2)}
              </p>
            </div>
            <Separator className="bg-muted-foreground/20 my-3" />
            <Link href="/events/buy/checkout/billing">
              <ActionButton2 className="w-full cursor-pointer py-7">
                Continue to Billing Details
              </ActionButton2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
