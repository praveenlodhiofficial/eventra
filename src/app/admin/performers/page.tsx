import { PerformerCard } from "@/components/admin/PerformerCard";
import { PerformerModal } from "@/components/modals/performer/performer-modal";
import { listPerformersAction } from "@/domains/performer/performer.actions";

export default async function AdminPerformersPage() {
  const res = await listPerformersAction();

  const performers = res.data;

  if (!performers || performers.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Performers
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Manage artists and speakers that appear on event pages.
            </p>
          </div>
          <PerformerModal type="create" />
        </div>

        <div className="bg-muted/20 rounded-3xl border p-10">
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
            <div className="bg-accent text-muted-foreground flex h-12 w-12 items-center justify-center rounded-2xl border text-lg">
              <span aria-hidden>👤</span>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold">No performers yet</div>
              <div className="text-muted-foreground text-sm">
                Create your first performer to start building lineups.
              </div>
            </div>
            <div className="pt-2">
              <PerformerModal type="create" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Performers
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {performers.length} performer{performers.length === 1 ? "" : "s"} in
            your catalog.
          </p>
        </div>
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
            bio={performer.bio}
          />
        ))}
      </div>
    </div>
  );
}
