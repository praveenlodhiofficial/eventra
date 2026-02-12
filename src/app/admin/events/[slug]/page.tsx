import { Image } from "@imagekit/next";
import { format, isSameDay } from "date-fns";

import { DataTable } from "@/components/admin/DataTable";
import { ArtistSpotlight } from "@/components/ArtistSpotlight";
import { ticketTypeColumns } from "@/components/data-table/ticket-type-columns";
import { TicketTypeModal } from "@/components/modals/ticket-type/ticket-type-modal";
import { ReadMore } from "@/components/ui/read-more";
import { Separator } from "@/components/ui/separator";
import { getEventAction } from "@/domains/event/event.actions";
import { listTicketTypesAction } from "@/domains/ticket-type/ticket-type.actions";
import { TicketType } from "@/domains/ticket-type/ticket-type.schema";
import { config } from "@/lib/config";

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const res = await getEventAction({ slug });

  if (!res.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching event data
      </div>
    );
  }

  const event = res.data;

  if (!event) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Event not found
      </div>
    );
  }

  const ticketTypes = await listTicketTypesAction(event.id);

  if (!ticketTypes.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching ticket types data
      </div>
    );
  }

  const ticketTypesData: TicketType[] =
    ticketTypes.data?.map((ticketType) => ({
      name: ticketType.name,
      price: Number(ticketType.price),
      quantity: ticketType.quantity,
      eventId: event.id,
    })) ?? [];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_0.01fr_0.80fr]">
      {/* =========================== Event Details (Left Side) =========================== */}
      <div className="flex flex-col gap-5 md:gap-10">
        {/* =============== Event Name + Description + Cover Image + Artist Lineup + Gallery Images ================= */}
        <div className="flex flex-col gap-3">
          {/* Event Name */}
          <h1 className="text-2xl font-semibold md:text-3xl">{event.name}</h1>

          {/* Cover Image */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <Image
              urlEndpoint={config.imagekit.url_endpoint}
              src={event.coverImage}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Event Description */}
          <ReadMore
            text={event.description}
            lines={5}
            className="text-muted-foreground text-sm font-light whitespace-pre-line"
          />
        </div>

        {/* Artist Lineup */}
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-medium md:text-xl">Artist Lineup</h1>
          <ArtistSpotlight
            performers={event.performers}
            className="scrollbar-hide w-full origin-left scale-80 overflow-x-auto scroll-smooth"
          />
        </div>

        {/* Gallery Images */}
        <div className="flex flex-col gap-2">
          <h1 className="text-base font-medium md:text-xl">Gallery Images</h1>
          <div className="grid grid-cols-3 gap-2">
            {event.images.map((image) => (
              <Image
                urlEndpoint={config.imagekit.url_endpoint}
                key={image.url}
                src={image.url}
                alt={`${event.name} - Gallery Image`}
                height={300}
                width={300}
                transformation={[{ height: 400, width: 400 }]}
                className="aspect-video rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <Separator orientation="vertical" className="bg-muted-foreground/30" />

      {/* =========================== Event Details (Right Side) =========================== */}
      <div className="flex flex-col gap-5 md:gap-10">
        {/* =============== Event Details Table ================= */}
        <div className="flex flex-col gap-3">
          <h1 className="text-base font-medium md:text-xl">Event Details</h1>
          <div className="border-muted-foreground overflow-hidden rounded-xl border">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b border-neutral-800">
                  <td className="bg-muted w-1/3 px-4 py-2 font-medium">
                    Event Category
                  </td>
                  <td className="px-4 py-2">
                    {event.categories.map((category) => (
                      <span key={category.name} className="mr-2">
                        {category.name}
                      </span>
                    ))}
                  </td>
                </tr>

                <tr className="border-b border-neutral-800">
                  <td className="bg-muted w-1/3 px-4 py-2 font-medium">
                    Event Venue
                  </td>
                  <td className="px-4 py-2">{event.venue.name}</td>
                </tr>

                <tr className="border-b border-neutral-800">
                  <td className="bg-muted w-1/3 px-4 py-2 font-medium">
                    Event Date
                  </td>
                  <td className="px-4 py-2">
                    {isSameDay(event.startAt, event.endAt) ? (
                      <>{format(event.startAt, "dd MMM yyyy")}</>
                    ) : (
                      <>
                        {format(event.startAt, "dd MMM yyyy")} →{" "}
                        {format(event.endAt, "dd MMM yyyy")}
                      </>
                    )}
                  </td>
                </tr>

                <tr className="border-b border-neutral-800">
                  <td className="bg-muted w-1/3 px-4 py-2 font-medium">
                    Event Time
                  </td>
                  <td className="px-4 py-2">
                    {format(event.startAt, "p")} → {format(event.endAt, "p")}
                  </td>
                </tr>

                <tr>
                  <td className="bg-muted w-1/3 px-4 py-2 font-medium">
                    {" "}
                    Event Venue
                  </td>
                  <td className="px-4 py-2">
                    {event.venue.name}, {event.venue.city}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* =============== Event Ticket Details ================= */}
        <div className="flex flex-col gap-3">
          {/* Event Ticket Details */}
          <h1 className="text-base font-medium md:text-xl">
            Event Ticket Details
          </h1>
          <DataTable
            columns={ticketTypeColumns}
            data={ticketTypesData}
            toolbarAction={<TicketTypeModal eventId={event.id} />}
            showColumnToggle={false}
            showSearch={false}
          />
        </div>
      </div>
    </div>
  );
}
