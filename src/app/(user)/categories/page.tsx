import Link from "next/link";

import { Container } from "@/components/ui/container";
import { findEventCategories } from "@/domains/event-categories/event-categories.dal";

export default async function CategoriesPage() {
  const categories = await findEventCategories();

  if (!categories) {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center gap-4 text-xl font-medium">
        <p>No categories found</p>
      </div>
    );
  }
  return (
    <Container className="mx-auto w-full max-w-7xl space-y-5 md:space-y-8">
      <h1 className="text-2xl font-semibold md:text-3xl">Categories</h1>
      <div className="flex flex-wrap gap-5">
        {categories.map((category) => (
          <Link href={`/categories/${category.slug}`} key={category.id}>
            <div className="bg-accent flex aspect-3/4 h-[18vh] items-center justify-center rounded-3xl p-4 text-center text-sm font-medium md:h-[20vh] md:items-end md:text-lg md:font-semibold lg:h-[30vh]">
              {category.name}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
