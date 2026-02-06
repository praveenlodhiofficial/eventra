import { getPerformersAction } from "@/domains/performer/performer.actions";

import { columns } from "./performer-columns";
import { DataTable } from "./performer-data-table";

export default async function AdminPerformersPage() {
  const res = await getPerformersAction();

  if (!res.success) {
    return <div>Error fetching performers data</div>;
  }

  const performers = res.data;

  if (!performers || performers.length === 0) {
    return <div>No performers found</div>;
  }

  return (
    <div className="mx-auto w-full px-5">
      <DataTable columns={columns} data={performers} />
    </div>
  );
}
