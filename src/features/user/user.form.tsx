"use client";

import {
   ImageUploadField,
   PhoneField,
   ReadonlyField,
   TextareaField,
   TextInputField,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateCurrentUser, UserSchema, userSchema } from "@/features/user";
import { Roles } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UserForm({
   defaultValues,
   onSubmit,
   userId,
}: {
   defaultValues?: Partial<UserSchema>;
   onSubmit?: (values: UserSchema) => Promise<void>;
   userId?: string;
}) {
   const form = useForm<UserSchema>({
      resolver: zodResolver(userSchema),
      values: {
         ...defaultValues,
         name: defaultValues?.name ?? "",
         email: defaultValues?.email ?? "",
         phone: defaultValues?.phone ?? "",
         address: defaultValues?.address ?? "",
         city: defaultValues?.city ?? "",
         state: defaultValues?.state ?? "",
         country: defaultValues?.country ?? "",
         pinCode: defaultValues?.pinCode ?? "",
         imageUrl: defaultValues?.imageUrl ?? "",
         role: defaultValues?.role ?? Roles.ATTENDEE,
         salt: defaultValues?.salt,
      },
   });

   const { isDirty } = form.formState;

   async function handleSubmit(data: UserSchema) {
      if (onSubmit) {
         await onSubmit(data);
         return;
      }

      const currentUserId = userId || defaultValues?.id;
      if (!currentUserId) {
         toast.error("User ID is required for updating profile");
         return;
      }

      try {
         const result = await updateCurrentUser({
            id: currentUserId,
            name: data.name,
            email: data.email,
            phone: data.phone ?? null,
            address: data.address ?? null,
            city: data.city ?? null,
            state: data.state ?? null,
            country: data.country ?? null,
            pinCode: data.pinCode ?? null,
            imageUrl: data.imageUrl ?? null,
         });

         if (result.success) {
            toast.success(result.message);
            form.reset(data);
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.error("Error updating user profile", error);
         toast.error(
            error instanceof Error ? error.message : "Something went wrong! Please try again."
         );
      }
   }

   return (
      <div className="w-full overflow-hidden">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="flex flex-col gap-6 bg-transparent p-5"
            >
               {/* Profile Section */}
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="relative flex h-10 items-end md:h-20 lg:h-30">
                     <h1 className="absolute -bottom-2 -left-1.5 z-[-1] bg-gradient-to-t from-transparent via-zinc-100 to-zinc-300 bg-clip-text text-[3rem] font-semibold text-transparent md:text-[5rem] lg:text-[7rem]">
                        Profile
                     </h1>
                     <h1 className="relative text-[1.5rem] font-semibold md:text-[2.5rem] lg:text-[3.5rem]">
                        Profile
                     </h1>
                  </div>
                  {/* Submit Button */}
                  <Button
                     type="submit"
                     disabled={!isDirty}
                     className="hidden w-fit bg-black text-white disabled:cursor-not-allowed disabled:bg-gray-400 md:block"
                  >
                     Update Profile
                  </Button>
               </div>

               {/* Profile Details */}
               <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:gap-10">
                  {/* Left Side */}
                  <div className="flex flex-col gap-5">
                     {/* Name */}
                     <TextInputField
                        control={form.control}
                        name={"name"}
                        label="Name"
                        placeholder="Name"
                        inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm text-[13px] transition-all duration-200"
                     />

                     {/* Email - Phone Number - Role */}
                     <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Email */}
                        <TextInputField
                           control={form.control}
                           name={"email"}
                           label="Email"
                           placeholder="Email"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />

                        {/* Phone Number */}
                        <PhoneField
                           control={form.control}
                           name={"phone"}
                           label="Phone Number"
                           countryCode={"+91"}
                           itemClassName="flex w-full flex-col gap-1"
                           inputClassName="-ml-px w-full rounded-md rounded-l-none border border-dashed border-gray-400 bg-white px-4 py-1.5 text-sm shadow-xs transition-all duration-200 focus:outline-none"
                        />
                     </div>

                     {/* City - State - Country - Pin Code */}
                     <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {/* City */}
                        <TextInputField
                           control={form.control}
                           name={"city"}
                           label="City"
                           placeholder="City"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />

                        {/* State */}
                        <TextInputField
                           control={form.control}
                           name={"state"}
                           label="State"
                           placeholder="State"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />

                        {/* Country */}
                        <TextInputField
                           control={form.control}
                           name={"country"}
                           label="Country"
                           placeholder="Country"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />

                        {/* Pin Code */}
                        <TextInputField
                           control={form.control}
                           name={"pinCode"}
                           label="Pin Code"
                           placeholder="Pin Code"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />
                     </div>

                     {/* Address */}
                     <TextareaField
                        control={form.control}
                        name={"address"}
                        label="Address"
                        placeholder="Address"
                        rows={10}
                        textareaClassName="w-full rounded-md border border-dashed border-gray-400 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                     />
                  </div>

                  {/* Right Side */}
                  <div className="flex w-full flex-col gap-5 md:flex-row lg:w-[450px] lg:flex-col">
                     {/* Profile Image */}
                     <ImageUploadField
                        control={form.control}
                        name={"imageUrl"}
                        label="Profile Image"
                        folder="eventra/users"
                        type="image"
                        accept="image/*"
                     />

                     {/* Role */}
                     <ReadonlyField
                        control={form.control}
                        name={"role"}
                        label="Role"
                        placeholder="Role"
                        inputClassName="w-full cursor-not-allowed rounded-md border border-dashed border-gray-700 bg-gray-100 px-3 py-2 text-sm transition-all duration-200"
                     />
                  </div>
               </div>

               {/* Mobile Submit Button */}
               <Button
                  type="submit"
                  disabled={!isDirty}
                  className="w-full bg-black text-white disabled:cursor-not-allowed disabled:bg-gray-400 md:hidden"
               >
                  Update Profile
               </Button>
            </form>
         </Form>
      </div>
   );
}
