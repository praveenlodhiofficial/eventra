import { getAllVenues } from "@/data-access-layer/venue.dal";

import { columns } from "./venue-columns";
import { DataTable } from "./venue-data-table";

export default async function VenuesPage() {
  const res = await getAllVenues();

  if (!res.success) {
    return <div>Error fetching venues data</div>;
  }

  const venues = res.data;

  if (!venues || venues.length === 0) {
    return <div>No venues found</div>;
  }

  return (
    <div className="mx-auto w-full px-5">
      <DataTable columns={columns} data={venues} />
    </div>
  );
}
