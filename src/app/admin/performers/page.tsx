import { PerformerCard } from "@/components/admin/PerformerCard";
import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { listPerformersAction } from "@/domains/performer/performer.actions";

export default async function AdminPerformersPage() {
  const res = await listPerformersAction();

  const performers = res.data;

  if (!performers || performers.length === 0) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No performers found</p>
        <PerformerModal type="create" />
      </div>
    );
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
            id={performer.id}
            href={`/admin/performers/${performer.slug}`}
            name={performer.name}
            image={performer.image}
            role={performer.role}
          />
        ))}
      </div>
    </div>
  );
}
