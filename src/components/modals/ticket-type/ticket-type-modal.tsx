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
  createTicketTypeAction,
  updateTicketTypeAction,
} from "@/domains/ticket-type/ticket-type.actions";
import {
  TicketTypeInput,
  TicketTypeSchema,
} from "@/domains/ticket-type/ticket-type.schema";

type Props = {
  eventId: string;
  mode?: "create" | "update";
  ticketType?: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
};

export function TicketTypeModal({
  eventId,
  mode = "create",
  ticketType,
}: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isUpdate = mode === "update";

  const form = useForm<TicketTypeInput>({
    resolver: zodResolver(TicketTypeSchema),
    defaultValues: {
      name: ticketType?.name ?? "",
      price: ticketType?.price ?? 0,
      quantity: ticketType?.quantity ?? 1,
      eventId,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: TicketTypeInput) {
    startTransition(async () => {
      const result = isUpdate
        ? await updateTicketTypeAction(ticketType!.id, data)
        : await createTicketTypeAction({ ...data, eventId });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setIsOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <ActionButton2 variant="outline" className="gap-2">
            Update Ticket
          </ActionButton2>
        ) : (
          <ActionButton2
            variant="secondary"
            className="flex w-full cursor-pointer items-center gap-2"
          >
            <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
            <span className="ml-2">Add Tickets</span>
          </ActionButton2>
        )}
      </DialogTrigger>

      <DialogContent className="h-full w-full rounded-none md:h-[calc(100vh-17rem)] md:max-w-xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-y-auto"
          >
            <DialogHeader className="bg-background sticky top-0 z-10 items-center">
              <DialogTitle className="border-primary border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-xl">
                {isUpdate ? "Update Ticket Type" : "Add Ticket Type"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Ticket type form
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              {/* Name */}
              <Field>
                <FieldLabel>Ticket Name</FieldLabel>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="VIP / General / Early Bird"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              {/* Price */}
              <Field>
                <FieldLabel>Price</FieldLabel>
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>

              {/* Quantity */}
              <Field>
                <FieldLabel>Quantity</FieldLabel>
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Field>
            </FieldGroup>

            <DialogFooter className="bg-background sticky bottom-0 z-10 grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline" className="w-full">
                  Cancel
                </ActionButton2>
              </DialogClose>

              <ActionButton2
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isUpdate ? (
                  "Update Ticket"
                ) : (
                  "Create Ticket"
                )}
              </ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
