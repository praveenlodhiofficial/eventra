import { DataTable } from "@/components/admin/DataTable";
import { venueColumns } from "@/components/data-table/venue-columns";
import { AddVenueModal } from "@/components/modals/venue/add-venue-modal";
import { listVenuesAction } from "@/domains/venue/venue.actions";

export default async function VenuesPage() {
  const res = await listVenuesAction();

  if (!res.success) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Error fetching venues data
      </div>
    );
  }

  const venues = res.data;

  if (!venues || venues.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No venues found</p>
        <AddVenueModal />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <DataTable
        columns={venueColumns}
        data={venues}
        toolbarAction={<AddVenueModal />}
      />
    </div>
  );
}
