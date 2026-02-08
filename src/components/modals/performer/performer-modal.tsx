"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleFadingPlusIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
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
  createPerformerAction,
  updatePerformerAction,
} from "@/domains/performer/performer.actions";
import {
  Performer,
  PerformerInput,
  PerformerSchema,
} from "@/domains/performer/performer.schema";

type Props = { type: "create" } | { type: "update"; performer: Performer };

export function PerformerModal(props: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isUpdate = props.type === "update";
  const performer = isUpdate
    ? props.performer
    : {
        name: "Justin Bieber",
        image: "",
        bio: "Justin Bieber is a Canadian singer, songwriter, and actor. He is known for his pop music and has sold over 150 million records worldwide. He is one of the best-selling artists of all time.",
      };

  if (!performer) {
    throw new Error("Performer not found");
  }

  const form = useForm<PerformerInput>({
    resolver: zodResolver(PerformerSchema),
    defaultValues: {
      id: performer.id,
      name: performer.name,
      image: performer.image,
      bio: performer.bio,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: PerformerInput) {
    startTransition(async () => {
      const result = isUpdate
        ? await updatePerformerAction(performer.id!, data)
        : await createPerformerAction(data);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(`/admin/performers/${result.data.slug}`);
      form.reset();
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <ActionButton2 variant="outline" className="w-fit">
            Edit Details
          </ActionButton2>
        ) : (
          <ActionButton2
            variant="outline"
            className="flex w-fit cursor-pointer items-center gap-2"
          >
            <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
            <span className="ml-2">Add Performer</span>
          </ActionButton2>
        )}
      </DialogTrigger>

      <DialogContent className="h-full w-full rounded-none md:h-[calc(100vh-7rem)] md:max-w-xl lg:rounded-3xl">
        <Form {...form} key={isUpdate ? performer.id : "create"}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 z-5 items-center justify-center">
              <DialogTitle className="border-primary border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-xl">
                {isUpdate ? "Update Performer Details" : "Add Performer"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Provide the required information to add a new performer to the
                platform.
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
                          onUploaded={(url) => field.onChange(url)}
                          onRemoved={() =>
                            form.setValue("image", "", {
                              shouldValidate: false,
                              shouldDirty: false,
                              shouldTouch: false,
                            })
                          }
                          defaultImage={performer?.image}
                          quality={80}
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

            <DialogFooter className="bg-background sticky bottom-0 z-5 grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline" className="w-full">
                  Cancel
                </ActionButton2>
              </DialogClose>

              <ActionButton2
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : isUpdate ? (
                    "Update Performer"
                  ) : (
                    "Add Performer"
                  )}
                </div>
              </ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
