import { Music, Sparkles } from "lucide-react";

import { PerformerCard } from "@/components/PerformerCard";
import { PerformerFilter } from "@/components/PerformerFilter";
import { Container } from "@/components/ui/container";
import {
  findAllPerformers,
  findPerformersByRole,
  getUniquePerformerRoles,
} from "@/domains/performer/performer.dal";

export default async function PerformersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const selectedRole =
    typeof sp.role === "string" && sp.role.length ? sp.role : null;

  // Get all roles and performers
  const [allPerformers, roles] = await Promise.all([
    selectedRole ? findPerformersByRole(selectedRole) : findAllPerformers(),
    getUniquePerformerRoles(),
  ]);

  return (
    <div className="min-h-screen">
      {/* Premium Hero Section */}
      <section className="from-primary/5 via-background to-background relative overflow-hidden border-b bg-linear-to-br py-12 md:py-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute top-1/2 -left-40 h-80 w-80 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <Container className="relative z-10">
          <div className="space-y-3 text-center md:space-y-4">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm">
              <Sparkles className="h-4 w-4" />
              <span className="font-medium">Performers</span>
            </div>
            <h1 className="from-foreground via-foreground to-foreground/80 bg-linear-to-r bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
              Discover Amazing Performers
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg md:text-xl">
              Find artists, speakers, and creators for your next event. Filter
              by role and discover the perfect talent.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <Container className="space-y-12 py-12 md:py-16">
        {/* Filter Row */}
        <div>
          <PerformerFilter roles={roles} />
        </div>

        {/* performers Grid or Empty State */}
        {allPerformers.length === 0 ? (
          /* Premium Empty State */
          <div className="flex h-80 items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-muted rounded-full p-6">
                  <Music className="text-muted-foreground h-8 w-8" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No performers found</h3>
                <p className="text-muted-foreground mx-auto max-w-sm">
                  {selectedRole
                    ? `Try browsing other categories or check back soon for more ${selectedRole} performers.`
                    : "Check back soon for more performers to join our platform."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Grid */
          <div className="space-y-6">
            <div className="text-muted-foreground text-sm">
              Showing {allPerformers.length} performer
              {allPerformers.length !== 1 ? "s" : ""}
              {selectedRole && ` in ${selectedRole}`}
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {allPerformers.map((performer) => (
                <PerformerCard
                  key={performer.id}
                  performer={{
                    id: performer.id,
                    name: performer.name,
                    slug: performer.slug,
                    image: performer.image,
                    role: performer.role,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
