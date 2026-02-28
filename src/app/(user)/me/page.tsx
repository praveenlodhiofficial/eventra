import { redirect } from "next/navigation";

import { UserForm } from "@/components/modals/user/user.form";
import { Container } from "@/components/ui/container";
import { getSession } from "@/domains/auth/auth.actions";
import { getUserById } from "@/domains/user/user.dal";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.userId);

  if (!user) {
    redirect("/sign-in");
  }

  console.log(JSON.stringify(user, null, 2));

  return (
    <div>
      <h1 className="bg-muted-foreground/10 p-2 text-center text-base font-semibold uppercase md:text-xl">
        My Profile
      </h1>
      <Container className="mx-auto flex items-center justify-center">
        {/* @ts-expect-error - user is not undefined */}
        <UserForm user={user} />
      </Container>
    </div>
  );
}
