"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CoverImageUpload } from "@/components/upload/CoverImageUpload";
import { updateUserAction } from "@/domains/user/user.actions";
import {
  User,
  UserUpdateInput,
  UserUpdateSchema,
} from "@/domains/user/user.schema";

type Props = {
  user: User;
};

export function UserForm({ user }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
      avatar: user.avatar ?? "",
      phoneNumber: user.phoneNumber ?? "",
    },
  });

  function onSubmit(data: UserUpdateInput) {
    startTransition(async () => {
      const result = await updateUserAction(user.id!, data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="bg-background w-2xl rounded-lg border p-6 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            {/* Name */}
            <Field>
              <FieldLabel>User Name</FieldLabel>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="User Name"
                        className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Email"
                        className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>

            {/* Phone */}
            <Field>
              <FieldLabel>Phone Number</FieldLabel>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Phone number"
                        className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>

            {/* Avatar */}
            <Field>
              <FieldLabel>User Avatar</FieldLabel>
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="z-0">
                    <FormControl>
                      <CoverImageUpload
                        folder="eventra/users"
                        placeholder="Upload Profile Picture"
                        onUploaded={(url) => field.onChange(url)}
                        onRemoved={() =>
                          form.setValue("avatar", "", {
                            shouldValidate: false,
                            shouldDirty: false,
                            shouldTouch: false,
                          })
                        }
                        defaultImage={user.avatar}
                        quality={80}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>
          </FieldGroup>

          <ActionButton2
            type="submit"
            className="w-full"
            disabled={isPending || !form.formState.isDirty}
            isLoading={isPending}
          >
            <div className="flex items-center gap-2">
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </div>
          </ActionButton2>
        </form>
      </Form>
    </div>
  );
}
