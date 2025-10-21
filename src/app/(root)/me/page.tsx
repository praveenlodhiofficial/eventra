import { getCurrentUser } from "@/features/user";
import UserForm from "@/features/user/user.form";
import { UserSchema } from "@/features/user/user.schema";

export default async function ProfilePage({
   defaultValues,
   onSubmit,
   userId,
}: {
   defaultValues?: Partial<UserSchema>;
   onSubmit?: (values: UserSchema) => Promise<void>;
   userId?: string;
}) {
   // If no defaultValues or userId provided, fetch from session
   let userData = defaultValues;

   if (!defaultValues && !userId) {
      const user = await getCurrentUser({ withFullUser: true });
      if (user) {
         userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone ?? undefined,
            address: user.address ?? undefined,
            city: user.city ?? undefined,
            state: user.state ?? undefined,
            country: user.country ?? undefined,
            pinCode: user.pinCode ?? undefined,
            imageUrl: user.imageUrl ?? undefined,
            role: user.role as "ORGANIZER" | "ADMIN" | "ATTENDEE" | "SPONSOR",
            salt: undefined, // Salt is not included in getCurrentUser for security
         };
      }
   }

   return <UserForm defaultValues={userData} onSubmit={onSubmit} userId={userId} />;
}
