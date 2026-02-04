const eventCategories = [
  { label: "Music" },
  { label: "Nightlife" },
  { label: "Comedy" },
  { label: "Sports" },
  { label: "Performances" },
  { label: "Food & Drinks" },
  { label: "Fests & Fairs" },
  { label: "Social Mixers" },
  { label: "Screenings" },
  { label: "Fitness" },
  { label: "Art Exhibitions" },
  { label: "Conferences" },
  { label: "Open Mics" },
];

export function EventCategories() {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="grid w-max grid-flow-col grid-rows-2 gap-3 md:gap-5">
        {eventCategories.map((category) => (
          <div
            key={category.label}
            className="bg-accent flex aspect-3/4 h-[18vh] items-center justify-center rounded-3xl p-4 text-center text-sm font-medium md:h-[20vh] md:items-end md:text-lg md:font-semibold lg:h-[30vh]"
          >
            {category.label}
          </div>
        ))}
      </div>
    </div>
  );
}
