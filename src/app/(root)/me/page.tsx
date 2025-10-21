import { getCurrentUserFromSession } from "@/features/user/user.action";
import { UserSchema } from "@/features/user/user.schema";
import UserForm from "@/features/user/user.form";

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
      const result = await getCurrentUserFromSession();
      if (result.success && result.data) {
         userData = {
            id: result.data.id,
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone ?? undefined,
            address: result.data.address ?? undefined,
            city: result.data.city ?? undefined,
            state: result.data.state ?? undefined,
            country: result.data.country ?? undefined,
            pinCode: result.data.pinCode ?? undefined,
            imageUrl: result.data.imageUrl ?? undefined,
            role: result.data.role,
            salt: result.data.salt,
         };
      }
   }

   return <UserForm defaultValues={userData} onSubmit={onSubmit} userId={userId} />;
}
