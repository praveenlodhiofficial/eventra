import { PerformerCard } from "@/components/PerformerCard";
import { PerformerSearchBar } from "@/components/PerformerSearchBar";
import {
  findAllPerformers,
  findPerformersByRole,
} from "@/domains/performer/performer.dal";

export default async function PerformersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const selectedRole =
    typeof sp.role === "string" && sp.role.length ? sp.role : null;

  // Get all performers
  const allPerformers = selectedRole
    ? await findPerformersByRole(selectedRole)
    : await findAllPerformers();

  return (
    <div className="mx-auto space-y-10 px-3 py-8 md:mt-20 md:px-5 lg:max-w-7xl">
      <PerformerSearchBar />

      {/* Performers Grid */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {allPerformers.map((performer) => (
          <PerformerCard key={performer.id} performer={performer} />
        ))}
      </div>
    </div>
  );
}
