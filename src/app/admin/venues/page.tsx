import { DataTable } from "@/components/admin/DataTable";
import { listVenuesAction } from "@/domains/venue/venue.actions";

import { columns } from "./venue-columns";

export default async function VenuesPage() {
  const res = await listVenuesAction();

  if (!res.success) {
    return <div>Error fetching venues data</div>;
  }

  const venues = res.data;

  if (!venues || venues.length === 0) {
    return <div>No venues found</div>;
  }

  return (
    <div className="mx-auto w-full">
      <DataTable columns={columns} data={venues} />
    </div>
  );
}
