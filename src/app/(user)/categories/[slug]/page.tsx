import { Container } from "@/components/ui/container";
import { EventsWrapper } from "@/components/wrapper/EventsWrapper";
import { findEventCategory } from "@/domains/event-categories/event-categories.dal";

export default async function EventCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const category = await findEventCategory({ slug });

  if (!category) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
        Category not found
      </div>
    );
  }

  return (
    <div>
      <h1 className="bg-muted-foreground/10 p-2 text-center text-base font-semibold uppercase md:text-xl">
        {category.name} Category
      </h1>

      {category.events.length > 0 ? (
        <Container className="mx-auto flex w-full max-w-7xl gap-5">
          <EventsWrapper categoryId={category.id} />
        </Container>
      ) : (
        <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-xl font-medium">
          No events found
        </div>
      )}
    </div>
  );
}
