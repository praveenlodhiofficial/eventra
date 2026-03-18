"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PerformerPicker } from "@/components/modals/performer/pick-performer";
import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import { createTicketTypeAction } from "@/domains/ticket-type/ticket-type.actions";

import { EventCategoriesModal } from "../modals/event-categories/event-categories-modal";
import { PerformerModal } from "../modals/performer/performer-modal";
import { TicketTypeDraftModal } from "../modals/ticket-type/ticket-type-modal";
import { VenuePicker } from "../modals/venue/pick-venue";
import { VenueModal } from "../modals/venue/venue-modal";

type Props = {
  categories: EventCategory[];
};

type DraftTicket = {
  clientId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function CreateEventPageClient({ categories }: Props) {
  const router = useRouter();

  const [draftTickets, setDraftTickets] = useState<DraftTicket[]>([]);

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
      performerToBeAnnounced: false,
      venueToBeAnnounced: false,
      cityToBeAnnounced: false,
      scheduleToBeAnnounced: false,
      ticketTypesToBeAnnounced: false,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: EventInput) {
    // Client-side guards largely delegated to zod schema now

    startTransition(async () => {
      const result = await createEventAction(data);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      const createdEvent = result.data;

      if (draftTickets.length) {
        const ticketResults = await Promise.all(
          draftTickets.map((t) =>
            createTicketTypeAction({
              name: t.name,
              price: Number(t.price),
              quantity: Number(t.quantity),
              eventId: createdEvent.id,
            })
          )
        );

        const failed = ticketResults.filter((r) => !r.success);
        if (failed.length) {
          toast.error(
            `Event created, but ${failed.length} ticket type(s) failed. You can fix them from the event page.`
          );
        } else {
          toast.success("Ticket types created successfully");
        }
      }

      form.reset();
      setDraftTickets([]);

      router.push(`/admin/events/${createdEvent.slug}`);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="no-scrollbar flex flex-col gap-6 overflow-hidden"
      >
        <FieldGroup className="grid md:grid-cols-[2fr_1.2fr]">
          <FieldGroup className="space-y-5">
            {/* Name */}
            <Field>
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
            <Field className="space-y-1">
              <FieldLabel>Event Category</FieldLabel>

              <FormField
                control={form.control}
                name="categoryIds"
                key="categoryIds"
                render={({ field }) => {
                  const selected = field.value ?? [];

                  const toggle = (id: string, checked: boolean) => {
                    if (checked) {
                      field.onChange([...selected, id]);
                    } else {
                      field.onChange(selected.filter((c: string) => c !== id));
                    }
                  };

                  return (
                    <FormItem>
                      <FormControl>
                        <div className="flex flex-wrap gap-3">
                          {categories.map((category) => {
                            const isChecked = selected.includes(category.id!);

                            return (
                              <FormItem
                                key={category.id}
                                className="flex items-center space-y-0 space-x-1 rounded-md border p-3 pr-8 md:rounded-lg"
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

              <FieldGroup className="grid grid-cols-[1fr_0.4fr] gap-3">
                <FormField
                  control={form.control}
                  name="performerIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PerformerPicker
                          value={field.value ?? []}
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
              </FieldGroup>

              {/* Performers "to be announced" */}
              <FormField
                control={form.control}
                name="performerToBeAnnounced"
                render={({ field }) => (
                  <FormItem className="mt-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          const value = Boolean(checked);
                          field.onChange(value);

                          if (value) {
                            form.setValue("performerIds", [], {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="mt-0! text-sm font-normal">
                      Performers to be announced
                    </FormLabel>
                  </FormItem>
                )}
              />
            </Field>

            {/* Venue */}
            <Field>
              <FieldLabel>Event Venue</FieldLabel>

              <FieldGroup className="grid grid-cols-[1fr_0.4fr] gap-3">
                <FormField
                  control={form.control}
                  name="venueId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <VenuePicker
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onVenueSelect={(venue) => {
                            form.setValue("city", venue.city, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <VenueModal />
              </FieldGroup>

              {/* Venue "to be announced" */}
              <FormField
                control={form.control}
                name="venueToBeAnnounced"
                render={({ field }) => (
                  <FormItem className="mt-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className="mt-0! text-sm font-normal">
                      Venue details to be announced
                    </FormLabel>
                  </FormItem>
                )}
              />
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

              {/* City "to be announced" */}
              <FormField
                control={form.control}
                name="cityToBeAnnounced"
                render={({ field }) => (
                  <FormItem className="mt-2 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className="mt-0! text-sm font-normal">
                      City to be announced
                    </FormLabel>
                  </FormItem>
                )}
              />
            </Field>

            {/* Tickets */}
            <Field>
              <FieldLabel>Ticket Types (optional)</FieldLabel>
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <TicketTypeDraftModal
                  onSubmit={(values) => {
                    const clientId =
                      typeof crypto !== "undefined" && "randomUUID" in crypto
                        ? crypto.randomUUID()
                        : `${Date.now()}-${Math.random()}`;

                    setDraftTickets((prev) => [
                      ...prev,
                      {
                        clientId,
                        name: values.name,
                        price: values.price,
                        quantity: values.quantity,
                      },
                    ]);
                  }}
                />

                {draftTickets.length ? (
                  <div className="flex flex-col gap-2">
                    {draftTickets.map((t) => (
                      <div
                        key={t.clientId}
                        className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
                      >
                        <div className="min-w-0">
                          <div className="truncate font-medium">{t.name}</div>
                          <div className="text-muted-foreground">
                            Price: {t.price} · Qty: {t.quantity}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <TicketTypeDraftModal
                            mode="update"
                            ticket={{
                              name: t.name,
                              price: t.price,
                              quantity: t.quantity,
                            }}
                            trigger={
                              <ActionButton2 type="button" variant="outline">
                                Edit
                              </ActionButton2>
                            }
                            onSubmit={(updatedValues) => {
                              setDraftTickets((prev) =>
                                prev.map((x) =>
                                  x.clientId === t.clientId
                                    ? {
                                        ...x,
                                        name: updatedValues.name,
                                        price: updatedValues.price,
                                        quantity: updatedValues.quantity,
                                      }
                                    : x
                                )
                              );
                            }}
                          />
                          <ActionButton2
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setDraftTickets((prev) =>
                                prev.filter((x) => x.clientId !== t.clientId)
                              )
                            }
                          >
                            Remove
                          </ActionButton2>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No ticket types added yet.
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>

          <FieldGroup className="space-y-5">
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

            {/* Event Status */}
            <Field>
              <FieldLabel>Event Status</FieldLabel>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <Select value={field.value} onValueChange={field.onChange}>
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

            {/* Gallery */}
            <Field>
              <FieldLabel>Event Gallery Images</FieldLabel>
              <FormField
                control={form.control}
                name="images"
                render={() => (
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

            {/* Start / End */}
            <Field>
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
                                value={value ? format(value, "HH:mm") : ""}
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

              {/* Schedule "to be announced" */}
              <FormField
                control={form.control}
                name="scheduleToBeAnnounced"
                render={({ field }) => (
                  <FormItem className="mt-4 flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(Boolean(checked))
                        }
                      />
                    </FormControl>
                    <FormLabel className="mt-0! text-sm font-normal">
                      Date &amp; time to be announced
                    </FormLabel>
                  </FormItem>
                )}
              />
            </Field>
          </FieldGroup>
        </FieldGroup>

        <div className="flex justify-end gap-3 border-t pt-4">
          <ActionButton2
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </ActionButton2>

          <ActionButton2
            type="submit"
            disabled={isSubmitting}
            className="disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="flex items-center gap-2">
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Create Event"
              )}
            </div>
          </ActionButton2>
        </div>
      </form>
    </Form>
  );
}
