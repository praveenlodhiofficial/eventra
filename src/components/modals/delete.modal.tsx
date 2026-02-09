"use client";

import { startTransition, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { deleteEventCategoryAction } from "@/domains/event-categories/event-categories.actions";
import { deleteEventAction } from "@/domains/event/event.actions";
import { deletePerformerAction } from "@/domains/performer/performer.actions";
import { deleteVenueAction } from "@/domains/venue/venue.actions";
import { DeleteModalType } from "@/types/delete.types";

import { ActionButton2 } from "../ui/action-button";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Form } from "../ui/form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type Props = {
  type: DeleteModalType;
  id: string;
  //  trigger method to open the modal button icon or text
  trigger: "icon" | "text";
};

export function DeleteModal(props: Props) {
  const { type, id, trigger } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isEventCategory = type === DeleteModalType.EVENT_CATEGORY;
  const isPerformer = type === DeleteModalType.PERFORMER;
  const isEvent = type === DeleteModalType.EVENT;
  const isVenue = type === DeleteModalType.VENUE;

  const confirmationText = isEventCategory
    ? "delete event category"
    : isPerformer
      ? "delete performer"
      : isEvent
        ? "delete event"
        : "delete venue";

  const form = useForm<{ id: string; confirmation: string }>({
    defaultValues: {
      id,
      confirmation: "",
    },

    resolver: zodResolver(
      z.object({
        id: z.string(),
        confirmation: z
          .string()
          .refine(
            (val) => val === confirmationText,
            `Type "${confirmationText}" to confirm`
          ),
      })
    ),
  });

  const confirmationValue = useWatch({
    control: form.control,
    name: "confirmation",
  });

  const isMatch = confirmationValue === confirmationText;

  const { isSubmitting } = form.formState;

  function onSubmit(data: { id: string }) {
    startTransition(async () => {
      const result = isEventCategory
        ? await deleteEventCategoryAction(data.id)
        : isPerformer
          ? await deletePerformerAction(data.id)
          : isEvent
            ? await deleteEventAction(data.id)
            : isVenue
              ? await deleteVenueAction(data.id)
              : null;

      if (!result || !result.success) {
        console.error(result);
        toast.error(result?.message || "Something went wrong");
        return;
      }

      toast.success(result?.message || "Item deleted successfully");
      form.reset();
      setIsOpen(false);
    });
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger === "icon" ? (
          <Button variant="destructive" size="icon-sm" className="rounded-lg">
            <Trash2Icon className="size-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive-foreground flex w-full justify-start px-2 text-start font-normal"
          >
            Delete{" "}
            {isEventCategory
              ? "Category"
              : isPerformer
                ? "Performer"
                : isEvent
                  ? "Event"
                  : "Venue"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="h-fit max-w-[calc(100%-2rem)] md:max-w-md lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-5 overflow-hidden overflow-y-scroll"
          >
            {/* ================================== Dialog Header ================================== */}
            <DialogHeader className="bg-background sticky top-0 z-5 flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-lg lg:text-xl">
                Delete{" "}
                {isEventCategory
                  ? "Category"
                  : isPerformer
                    ? "Performer"
                    : isEvent
                      ? "Event"
                      : "Venue"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Delete the{" "}
                {isEventCategory
                  ? "category"
                  : isPerformer
                    ? "performer"
                    : isEvent
                      ? "event"
                      : "venue"}{" "}
                permanently
              </DialogDescription>
            </DialogHeader>

            {/* ================================== Dialog Body ================================== */}
            <FieldGroup>
              <p className="text-center text-sm">
                This action cannot be undone. To confirm, type
                <br />
                <span className="text-foreground font-bold">
                  {confirmationText}
                </span>
              </p>

              <Field>
                <FormField
                  control={form.control}
                  name="confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={confirmationText}
                          className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>

            {/* ================================== Dialog Footer Button ================================== */}
            <DialogFooter className="bg-background sticky bottom-0 z-5 grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline" className="w-full">
                  Cancel
                </ActionButton2>
              </DialogClose>

              <ActionButton2
                type="submit"
                disabled={!isMatch || isSubmitting}
                className="w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    `Delete ${isEventCategory ? "Category" : isPerformer ? "Performer" : isEvent ? "Event" : "Venue"}`
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
