import Image from "next/image";

export const eventCards = [
  {
    label: "Sonu Nigam Live in Concert | Mumbai",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1768801587/ixwzvqwsal2jfx7yjrul.jpg",
    price: 1499,
    location: "TMC Ground, Hiranandani Estate, Thane West, Thane",
    startDate: "Sat, 12 Jan",
    endDate: "Sat, 14 Jan",
    time: "7:00 PM",
  },
  {
    label: "Arijit Singh India Tour | Pune",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1768801587/ixwzvqwsal2jfx7yjrul.jpg",
    price: 1799,
    location: "Balewadi Stadium, Baner, Pune",
    startDate: "Sun, 19 Jan",
    endDate: "Sun, 19 Jan",
    time: "6:30 PM",
  },
  {
    label: "Comedy Night ft. Zakir Khan | Delhi",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1768801587/ixwzvqwsal2jfx7yjrul.jpg",
    price: 799,
    location: "Talkatora Indoor Stadium, Connaught Place, Delhi",
    startDate: "Fri, 24 Jan",
    endDate: "Fri, 24 Jan",
    time: "8:00 PM",
  },
  {
    label: "EDM Festival 2026 | Bangalore",
    image:
      "https://media.insider.in/image/upload/w_800/v1760685563/xthylybyrruskmwrb58p.jpg",
    price: 2499,
    location: "Nice Grounds, Madavara, Bangalore",
    startDate: "Sat, 1 Feb",
    endDate: "Sun, 2 Feb",
    time: "5:00 PM",
  },
  {
    label: "Taylor Swift Tribute Night | Goa",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1768801587/ixwzvqwsal2jfx7yjrul.jpg",
    price: 999,
    location: "Baga Beach Arena, North Goa",
    startDate: "Sat, 8 Feb",
    endDate: "Sat, 8 Feb",
    time: "9:00 PM",
  },
];

export function EventCard() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
      {eventCards.map((event) => {
        return (
          <div
            key={event.label}
            className="h-fit overflow-hidden rounded-3xl border lg:h-[65vh]"
          >
            <Image
              src={event.image}
              alt={event.label}
              width={500}
              height={500}
              className="aspect-10/11 h-fit object-cover lg:h-[72%]"
            />
            <div className="h-fit w-full space-y-1.5 p-3">
              {/* =========================== Event Date & Time =========================== */}
              {event.startDate &&
              event.endDate &&
              event.startDate === event.endDate ? (
                <div className="line-clamp-1 text-xs text-amber-600 md:line-clamp-none md:text-[13px]">
                  {event.startDate}, {event.time}
                </div>
              ) : (
                <div className="line-clamp-1 text-xs text-amber-600 md:line-clamp-none md:text-[13px]">
                  {event.startDate} - {event.endDate}, {event.time}
                </div>
              )}

              {/* =========================== Event Title =========================== */}
              <div className="text-[14px] leading-snug font-semibold md:text-[16px]">
                {event.label}
              </div>

              <div className="space-y-1 md:space-y-0">
                {/* =========================== Event Location =========================== */}
                <div className="text-muted-foreground line-clamp-1 text-xs">
                  {event.location}
                </div>

                {/* =========================== Event Price =========================== */}
                <div className="text-muted-foreground text-xs md:text-[13px]">
                  ₹{event.price} onwards
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
