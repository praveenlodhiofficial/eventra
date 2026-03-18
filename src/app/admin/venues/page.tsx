import { DataTable } from "@/components/admin/DataTable";
import { venueColumns } from "@/components/data-table/venue-columns";
import { VenueModal } from "@/components/modals/venue/venue-modal";
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
        <VenueModal />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <DataTable
        columns={venueColumns}
        data={venues.map((v) => ({
          ...v,
          lat: v.lat ?? undefined,
          lng: v.lng ?? undefined,
        }))}
        searchColumnId="name"
        searchPlaceholder="Search venues..."
        toolbarAction={<VenueModal />}
      />
    </div>
  );
}
