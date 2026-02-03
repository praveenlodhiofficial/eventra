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
    <div className="flex flex-wrap gap-5">
      {eventCategories.map((category) => (
        <div
          key={category.label}
          className="bg-accent flex aspect-3/4 h-[30vh] items-end justify-center rounded-3xl p-4 text-lg font-semibold"
        >
          {category.label}
        </div>
      ))}
    </div>
  );
}
