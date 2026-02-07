import { PerformerCard } from "@/components/admin/PerformerCard";
import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { getPerformersAction } from "@/domains/performer/performer.actions";

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
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <PerformerModal type="create" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {performers.map((performer) => (
          <PerformerCard
            key={performer.id}
            href={`/admin/performers/${performer.id}`}
            name={performer.name}
            image={performer.image}
          />
        ))}
      </div>
    </div>
  );
}
