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
import {
  createEventCategoryAction,
  updateEventCategoryAction,
} from "@/domains/event-categories/event-categories.actions";
import {
  EventCategory,
  EventCategoryInput,
  EventCategorySchema,
} from "@/domains/event-categories/event-categories.schema";

type Props =
  | { type: "create" }
  | { type: "update"; eventCategory: EventCategory };

export function EventCategoriesModal(props: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isUpdate = props.type === "update";
  const eventCategory = isUpdate ? props.eventCategory : { name: "" };

  if (!eventCategory) {
    throw new Error("Event category not found");
  }

  const form = useForm<EventCategoryInput>({
    resolver: zodResolver(EventCategorySchema),
    defaultValues: {
      id: eventCategory.id,
      name: eventCategory.name,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: EventCategoryInput) {
    startTransition(async () => {
      const result = isUpdate
        ? await updateEventCategoryAction(eventCategory.id!, data)
        : await createEventCategoryAction(data);

      if (!result.success) {
        console.error(result);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push(`/admin/event-categories`);
      form.reset();
      setIsOpen(false);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <ActionButton2 variant="outline" className="w-fit">
            Rename Category
          </ActionButton2>
        ) : (
          <ActionButton2
            variant="outline"
            className="flex w-fit cursor-pointer items-center gap-2"
          >
            <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
            <span className="ml-2">Add Category</span>
          </ActionButton2>
        )}
      </DialogTrigger>
      <DialogContent className="h-fit max-w-md lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-10 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 z-5 flex h-fit items-center justify-center">
              <DialogTitle className="border-primary border-y-2 px-5 py-1 text-center text-base font-semibold uppercase md:text-lg lg:text-xl">
                {isUpdate ? "Update Event Category" : "Create Event Category"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {isUpdate
                  ? "Update the event category name"
                  : "Provide the required information to create a new event category"}
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              {/* ================================== Name Input ================================== */}
              <Field>
                <FieldLabel>Event Category Name</FieldLabel>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Event Category Name"
                          className="w-full rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="bg-background sticky bottom-0 z-5 grid grid-cols-2 gap-3">
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
                    "Update Category"
                  ) : (
                    "Add Category"
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
