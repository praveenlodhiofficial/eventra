import { PerformerCard } from "@/components/admin/PerformerCard";
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
    <div className="grid grid-cols-2 gap-4 px-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {performers.map((performer) => (
        <PerformerCard
          key={performer.id}
          href={`/performers/${performer.id}`}
          name={performer.name}
          image={performer.image}
        />
      ))}
    </div>
  );
}
