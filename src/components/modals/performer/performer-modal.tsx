"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  AddPerformerAction,
  UpdatePerformerAction,
} from "@/domains/performer/performer.actions";
import {
  PerformerInput,
  PerformerSchema,
} from "@/domains/performer/performer.schema";

type Performer = {
  id: string;
  name: string;
  image: string;
  bio: string;
};

type Props = { type: "create" } | { type: "update"; performer: Performer };

export function PerformerModal(props: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isUpdate = props.type === "update";
  const performer = isUpdate
    ? props.performer
    : { id: "", name: "", image: "", bio: "" };

  const form = useForm<PerformerInput>({
    resolver: zodResolver(PerformerSchema),
    defaultValues: {
      name: performer?.name ?? "",
      image: performer?.image ?? "",
      bio: performer?.bio ?? "",
    },
  });

  async function onSubmit(data: PerformerInput) {
    startTransition(async () => {
      const result = isUpdate
        ? await UpdatePerformerAction(performer!.id, data)
        : await AddPerformerAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/admin");
      form.reset();
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{isUpdate ? "Edit" : "Add Performer"}</Button>
      </DialogTrigger>

      <DialogContent className="h-[calc(100vh-7rem)] md:max-w-xl lg:rounded-3xl">
        <Form {...form} key={isUpdate ? performer.id : "create"}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 items-center justify-center">
              <DialogTitle className="border-y-2 px-5 py-1 text-xl font-semibold uppercase">
                {isUpdate ? "Update Performer" : "Add Performer"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Performer form
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              {/* Image */}
              <Field>
                <FieldLabel>Performer Image</FieldLabel>
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CoverImageUpload
                          folder="eventra/performers"
                          defaultImage={performer?.image}
                          onUploaded={(url) => field.onChange(url)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              {/* Name */}
              <Field>
                <FieldLabel>Performer Name</FieldLabel>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Performer Name"
                          className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              {/* Bio */}
              <Field>
                <FieldLabel>Performer Bio</FieldLabel>
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <textarea
                          rows={10}
                          placeholder="Performer Bio"
                          className="rounded-lg border border-zinc-200 bg-white/10 p-3 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="bg-background sticky bottom-0 grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline">Cancel</ActionButton2>
              </DialogClose>

              <ActionButton2 type="submit">
                {isUpdate ? "Update Performer" : "Add Performer"}
              </ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
