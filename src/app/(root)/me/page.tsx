import UserForm from "@/features/user/user.form";

export default function ProfilePage() {
   return (
      <div className="flex h-full min-h-screen w-full flex-col space-y-5 p-5">
         <UserForm />
      </div>
   );
}
