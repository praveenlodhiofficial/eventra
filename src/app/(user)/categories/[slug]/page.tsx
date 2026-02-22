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
    <Container className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
      <h1 className="text-center text-2xl font-semibold md:text-3xl">
        Music Category
      </h1>
      <div className="flex gap-5">
        <EventsWrapper categoryId={category.id} />
      </div>
    </Container>
  );
}
