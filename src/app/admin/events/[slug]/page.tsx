import Image from "next/image";

import { getEventAction } from "@/domains/event/event.actions";

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
  console.log(`event: ${JSON.stringify(event, null, 2)}`);

  if (!event) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Event not found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Event Name */}
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold md:text-3xl">{event.name}</h1>
      </div>

      {/* Event Description */}
      <p className="text-muted-foreground text-sm font-light text-balance md:text-base">
        {event.description}
      </p>

      {/* Cover Image */}
      <div className="flex items-center gap-2">
        <p> Cover Image:</p>
        <Image
          src={event.coverImage}
          alt={event.name}
          width={300}
          height={300}
        />
      </div>

      {/* Gallery Images */}
      <div className="flex items-center gap-2">
        <p>Gallery Images:</p>
        {event.images.map((image) => (
          <Image
            key={image.url}
            src={image.url}
            alt={`${event.name} - Gallery Image`}
            width={300}
            height={300}
          />
        ))}
      </div>

      {/* Event Category */}
      <div className="flex items-center gap-2">
        <p>Event Category:</p>
        {event.categories.map((category) => (
          <p key={category.name}>{category.name}</p>
        ))}
      </div>

      {/* Event Performer */}
      <div className="flex items-center gap-2">
        <p>Event Performer:</p>
        {event.performers.map((performer) => (
          <p key={performer.name}>{performer.name}</p>
        ))}
      </div>

      {/* Event Venue */}
      <div className="flex items-center gap-2">
        <p>Event Venue:</p>
        <p>{event.venue.name}</p>
      </div>

      {/* Event Start Date */}
      <div className="flex items-center gap-2">
        <p>Event Start Date:</p>
        <p>{event.startDate.toLocaleDateString()}</p>
      </div>

      {/* Event End Date */}
      <div className="flex items-center gap-2">
        <p>Event End Date:</p>
        <p>{event.endDate.toLocaleDateString()}</p>
      </div>

      {/* Event Price */}
      <div className="flex items-center gap-2">
        <p>Event Price:</p>
        <p>{event.price.toNumber()}</p>
      </div>

      {/* Event City */}
      <div className="flex items-center gap-2">
        <p>Event City:</p>
        <p>{event.city}</p>
      </div>
    </div>
  );
}
