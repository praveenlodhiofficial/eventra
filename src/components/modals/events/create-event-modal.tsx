"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  CircleFadingPlusIcon,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { PerformerPicker } from "@/components/modals/performer/pick-performer";
import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoverImageUpload } from "@/components/upload/CoverImageUpload";
import { GalleryImageUpload } from "@/components/upload/GalleryImageUpload";
import { EventCategory } from "@/domains/event-categories/event-categories.schema";
import { createEventAction } from "@/domains/event/event.actions";
import { EVENT_STATUS } from "@/domains/event/event.constants";
import { EventInput, EventSchema } from "@/domains/event/event.schema";

import { EventCategoriesModal } from "../event-categories/event-categories-modal";
import { PerformerModal } from "../performer/performer-modal";
import { AddVenueModal } from "../venue/add-venue-modal";
import { VenuePicker } from "../venue/pick-venue";

/* -------------------------------------------------------------------------- */
/*                              Types                                          */
/* -------------------------------------------------------------------------- */

export function CreateEventModal({
  categories,
}: {
  categories: EventCategory[];
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "",
      description: "",
      coverImage: "",
      categoryIds: [],
      city: "",
      status: "DRAFT",
      performerIds: [],
      venueId: "",
      startAt: new Date(),
      endAt: new Date(),
      images: [],
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: EventInput) {
    if (!data.venueId) {
      toast.error("Please select a venue");
      return;
    }

    if (!data.categoryIds.length) {
      toast.error("Select at least one category");
      return;
    }

    if (data.endAt < data.startAt) {
      toast.error("End Date/Time must be after Start Date/Time");
      return;
    }

    startTransition(async () => {
      const result = await createEventAction(data);

      if (!result.success || !result.data) {
        console.error(result);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      form.reset();
      setIsOpen(false);
    });
    router.refresh();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ActionButton2
          variant="outline"
          className="flex w-fit cursor-pointer items-center gap-2"
        >
          <CircleFadingPlusIcon className="size-3.5 group-hover:animate-pulse" />
          <span className="ml-2">Create Event</span>
        </ActionButton2>
      </DialogTrigger>

      <DialogContent className="h-full w-full rounded-none md:h-[calc(100vh-7rem)] md:max-w-3xl lg:max-w-5xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="no-scrollbar relative flex flex-col gap-6 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="bg-background sticky top-0 z-5 flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-base font-semibold uppercase md:text-lg lg:text-xl">
                Create Event
              </DialogTitle>
              <DialogDescription className="sr-only">
                Provide the required information to list a new event on the
                platform.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="grid md:grid-cols-[2fr_1.2fr]">
              <FieldGroup>
                {/* Name */}
                <Field className="">
                  <FieldLabel>Event Name</FieldLabel>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Event Name"
                            className="rounded-lg border px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel>Event Description</FieldLabel>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <textarea
                            placeholder="Event Description"
                            rows={9}
                            className="rounded-lg border p-3 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* Categories */}
                <Field>
                  <FieldLabel>Event Category</FieldLabel>

                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => {
                      const selected = field.value ?? [];

                      const toggle = (id: string, checked: boolean) => {
                        if (checked) {
                          field.onChange([...selected, id]);
                        } else {
                          field.onChange(selected.filter((c) => c !== id));
                        }
                      };

                      return (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                              {categories.map((category) => {
                                const isChecked = selected.includes(
                                  category.id!
                                );

                                return (
                                  <FormItem
                                    key={category.id}
                                    className="flex items-center space-y-0 space-x-3 rounded-lg rounded-md border p-3 py-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          toggle(category.id!, Boolean(checked))
                                        }
                                      />
                                    </FormControl>

                                    <FormLabel className="line-clamp-1 cursor-pointer font-normal">
                                      {category.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              })}
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <EventCategoriesModal type="create" />
                </Field>

                {/* Performers */}
                <Field>
                  <FieldLabel>Event Performers</FieldLabel>

                  <FormField
                    control={form.control}
                    name="performerIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PerformerPicker
                            value={field.value}
                            onChange={(ids) =>
                              form.setValue("performerIds", ids, {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <PerformerModal type="create" />
                </Field>

                {/* Venue */}
                <Field className="mt-3">
                  <FieldLabel>Event Venue</FieldLabel>

                  <FormField
                    control={form.control}
                    name="venueId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <VenuePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AddVenueModal />
                </Field>

                {/* City */}
                <Field>
                  <FieldLabel>Event City</FieldLabel>
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Event City"
                            className="rounded-lg border px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                <FieldGroup className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      name: "startAt",
                      label: "Event Start",
                    },
                    {
                      name: "endAt",
                      label: "Event End",
                    },
                  ].map((fieldData) => (
                    <Field key={fieldData.name}>
                      <FieldLabel>{fieldData.label}</FieldLabel>

                      <FormField
                        control={form.control}
                        name={fieldData.name as keyof EventInput}
                        render={({ field }) => {
                          const value = field.value as Date | undefined;

                          return (
                            <FormItem className="grid grid-cols-2 gap-2 md:grid-cols-1">
                              {/* DATE */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className="justify-start rounded-lg border px-3 py-6 text-left text-sm font-light shadow-none"
                                    >
                                      {value
                                        ? format(value, "dd MMM yyyy")
                                        : "Select date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={value}
                                    onSelect={(date) => {
                                      if (!date) return;

                                      const current = value ?? new Date();
                                      date.setHours(
                                        current.getHours(),
                                        current.getMinutes()
                                      );

                                      field.onChange(date);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>

                              {/* TIME */}
                              <div className="relative">
                                <Input
                                  type="time"
                                  value={
                                    value
                                      ? format(value, "HH:mm") // needed for input
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const [hours, minutes] =
                                      e.target.value.split(":");

                                    const newDate = value
                                      ? new Date(value)
                                      : new Date();

                                    newDate.setHours(Number(hours));
                                    newDate.setMinutes(Number(minutes));

                                    field.onChange(newDate);
                                  }}
                                  className="rounded-lg border px-3 py-6 text-sm font-light shadow-none"
                                />
                                <Clock className="text-muted-foreground/85 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                              </div>

                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </Field>
                  ))}
                </FieldGroup>
              </FieldGroup>

              <FieldGroup>
                {/* Cover */}
                <Field>
                  <FieldLabel>Event Cover Image</FieldLabel>
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CoverImageUpload
                            folder="eventra/events"
                            onUploaded={(url) => field.onChange(url)}
                            onRemoved={() =>
                              form.setValue("coverImage", "", {
                                shouldValidate: false,
                                shouldDirty: false,
                                shouldTouch: false,
                              })
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price
                  <Field>
                    <FieldLabel>Event Price</FieldLabel>
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              value={field.value as number}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              placeholder="Event Price"
                              className="rounded-lg border px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field> */}

                  {/* Event Status */}
                  <Field>
                    <FieldLabel>Event Status</FieldLabel>

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl className="rounded-lg py-6">
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select event status" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent className="w-full">
                              {EVENT_STATUS.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Field>
                </div>

                {/* Gallery */}
                <Field>
                  <FieldLabel>Event Gallery Images</FieldLabel>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <GalleryImageUpload
                            folder="eventra/events"
                            onUploaded={(url) => {
                              const current = form.getValues("images") ?? [];
                              form.setValue("images", [...current, url], {
                                shouldDirty: true,
                                shouldTouch: true,
                                shouldValidate: true,
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              </FieldGroup>
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
                  ) : (
                    "Create Event"
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
