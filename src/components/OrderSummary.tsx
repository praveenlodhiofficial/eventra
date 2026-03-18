import { Image } from "@imagekit/next";
import { Lock } from "lucide-react";

import { getSession } from "@/domains/auth/auth.actions";
import { findBookingItems } from "@/domains/booking-item/booking-items.dal";
import { findBookingById } from "@/domains/booking/booking.dal";
import { findEvent } from "@/domains/event/event.dal";
import { config } from "@/lib/config";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
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
  const coverImage = event.coverImage ?? event.images?.[0]?.url ?? null;
  const totalAmount = Number(booking.totalAmount);

  // ============================== CALCULATE BOOKING FEE ================================
  const bookingFee = totalAmount * 0.118; // 11.8% GST
  const grandTotal = totalAmount + bookingFee;

  const hasSchedule = Boolean(event.startAt && event.endAt);
  const scheduleLabel = hasSchedule
    ? `${event.startAt!.toLocaleDateString("en-IN", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })} • ${event.startAt!.toLocaleDateString("en-IN", {
        weekday: "long",
      })}`
    : "Schedule to be announced";

  return (
    <div className="no-scrollbar py-6 md:h-full md:max-h-[calc(100vh-5rem)] md:overflow-y-auto lg:py-8">
      <Card className="via-background w-full border-indigo-500/15 bg-linear-to-br from-transparent to-indigo-500/5 p-4 md:p-6">
        <CardHeader className="space-y-2 px-0">
          <div className="flex items-end justify-between gap-4 md:items-center">
            <CardTitle className="text-lg tracking-tight">
              Order summary
            </CardTitle>
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Lock className="size-3.5" />
              Secure
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-5 font-medium md:text-base">
              {eventName}
            </p>
            <p className="text-muted-foreground text-xs">{scheduleLabel}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-0">
          {coverImage && (
            <div className="border-border/60 bg-muted/30 relative overflow-hidden rounded-xl border">
              <Image
                urlEndpoint={config.imagekit.url_endpoint}
                src={coverImage}
                alt={eventName}
                height={800}
                width={1200}
                className="aspect-video h-full w-full object-cover"
              />
            </div>
          )}
          <div className="overflow-hidden rounded-lg border border-indigo-500/15">
            <div className="text-muted-foreground grid grid-cols-[2fr_1fr_1fr] items-center gap-3 border-b border-indigo-500/15 bg-indigo-500/5 px-3 py-2 text-[11px] font-medium tracking-[0.14em] uppercase">
              <p>Ticket</p>
              <p className="text-right">Qty</p>
              <p className="text-right">Total</p>
            </div>
            <div className="divide-y divide-indigo-500/15">
              {bookingItems.map((item) => {
                const lineTotal = Number(item.price);
                const perTicket =
                  item.quantity > 0 ? lineTotal / item.quantity : lineTotal;

                return (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_1fr_1fr] items-center gap-3 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium md:text-[15px]">
                        {item.ticketType.name}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        ₹{perTicket.toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-right text-sm font-medium md:text-[15px]">
                      {item.quantity}
                    </p>
                    <p className="text-right text-sm font-semibold md:text-[15px]">
                      ₹{lineTotal.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          <div>
            <div className="grid grid-cols-[1fr_25%] gap-3 pb-3">
              <Input
                className="h-11 rounded-lg border-indigo-500/15 focus-visible:border-indigo-500/40 focus-visible:ring-4 focus-visible:ring-indigo-500/15"
                placeholder="Discount code"
              />
              <Button
                type="button"
                variant="default"
                className="h-full cursor-pointer rounded-lg"
              >
                Apply
              </Button>
            </div>
            <p className="text-muted-foreground pl-1 text-xs">
              Add a discount code if you have one.
            </p>
          </div>

          <Separator />

          <div className="space-y-3 rounded-xl border border-indigo-500/15 bg-indigo-500/5 p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-medium">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">Fees (incl. GST)</p>
              <p className="font-medium">₹{bookingFee.toFixed(2)}</p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold">Total</p>
              <p className="text-lg font-semibold tracking-tight">
                ₹{grandTotal.toFixed(2)}
              </p>
            </div>
            <p className="text-muted-foreground text-xs">
              Total includes taxes and processing fees.
            </p>
          </div>

          {/* ============================== VIEW EVENT OFFERS ============================== */}
          {/* <div className="overflow-hidden rounded-xl border border-indigo-500/15">
          <ActionButton1
            variant="ghost"
            className="flex w-full justify-between rounded-none py-6 hover:bg-indigo-500/5"
            icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
          >
            <BiSolidOffer className="mr-3 size-4.5 md:size-5" />
            <span className="text-sm font-normal capitalize md:text-base">
              View event offers
            </span>
          </ActionButton1>
          <Separator />
          <ActionButton1
            variant="ghost"
            className="flex w-full justify-between rounded-none py-6 hover:bg-indigo-500/5"
            icon={<ChevronsRightIcon className="size-5" strokeWidth={1.5} />}
          >
            <FaCreditCard className="mr-3 size-4 md:size-4.5" />
            <span className="text-sm font-normal capitalize md:text-base">
              View payment offers
            </span>
          </ActionButton1>
        </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
