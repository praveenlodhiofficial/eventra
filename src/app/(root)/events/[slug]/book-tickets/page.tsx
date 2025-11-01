import EventGradientBackground from "@/components/EventGradientBackground";
import { getEvent } from "@/features/event/event.action";
import { TicketBooking } from "@/components/TicketBooking";

export default async function TicketBookingPage({ params }: { params: { slug: string } }) {
   const { slug } = await params;
   const { event, success, message } = await getEvent(slug);

   if (!success || !event) return <div>{message}</div>;

   return (
      <EventGradientBackground coverImageUrl={event?.coverImageUrl || undefined}>
         <TicketBooking event={event} />
      </EventGradientBackground>
   );
}
