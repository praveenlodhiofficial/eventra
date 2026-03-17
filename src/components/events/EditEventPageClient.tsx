"use client";

import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image } from "@imagekit/next";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PerformerPicker } from "@/components/modals/performer/pick-performer";
import { AddVenueModal } from "@/components/modals/venue/add-venue-modal";
import { VenuePicker } from "@/components/modals/venue/pick-venue";
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
import { updateEventAction } from "@/domains/event/event.actions";
import { EVENT_STATUS } from "@/domains/event/event.constants";
import { EventInput, EventSchema } from "@/domains/event/event.schema";
import { PerformerSummary } from "@/domains/performer/performer.schema";
import {
  createTicketTypeAction,
  deleteTicketTypeAction,
} from "@/domains/ticket-type/ticket-type.actions";
import { TicketType } from "@/domains/ticket-type/ticket-type.schema";
import { VenueSummary } from "@/domains/venue/venue.schema";
import { config } from "@/lib/config";

import { PerformerModal } from "../modals/performer/performer-modal";
import {
  TicketTypeDraftModal,
  TicketTypeModal,
} from "../modals/ticket-type/ticket-type-modal";

type EditEventInitial = {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  status: string;
  city: string;
  cityToBeAnnounced: boolean;
  performerToBeAnnounced: boolean;
  venueToBeAnnounced: boolean;
  scheduleToBeAnnounced: boolean;
  categoryIds: string[];
  performerIds: string[];
  venueId: string;
  startAt: string | null;
  endAt: string | null;
  performerSummaries: PerformerSummary[];
  venueSummary: VenueSummary | null;
};

type Props = {
  categories: EventCategory[];
  initialEvent: EditEventInitial;
  existingTickets: TicketType[];
};

type DraftTicket = {
  clientId: string;
  name: string;
  price: number;
  quantity: number;
};

export default function EditEventPageClient({
  categories,
  initialEvent,
  existingTickets,
}: Props) {
  const router = useRouter();

  const [draftTickets, setDraftTickets] = useState<DraftTicket[]>([]);

  const initialPerformerCache = initialEvent.performerSummaries.reduce<
    Record<string, PerformerSummary>
  >((map, performer) => {
    map[performer.id] = performer;
    return map;
  }, {});

  const initialVenueCache: Record<string, VenueSummary> =
    initialEvent.venueSummary
      ? { [initialEvent.venueSummary.id]: initialEvent.venueSummary }
      : {};

  const form = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: initialEvent.name,
      description: initialEvent.description,
      coverImage: initialEvent.coverImage,
      categoryIds: initialEvent.categoryIds,
      city: initialEvent.city,
      status: initialEvent.status as EventInput["status"],
      performerIds: initialEvent.performerIds,
      venueId: initialEvent.venueId,
      startAt: initialEvent.startAt
        ? new Date(initialEvent.startAt)
        : new Date(),
      endAt: initialEvent.endAt ? new Date(initialEvent.endAt) : new Date(),
      images: initialEvent.images,
      performerToBeAnnounced: initialEvent.performerToBeAnnounced,
      venueToBeAnnounced: initialEvent.venueToBeAnnounced,
      cityToBeAnnounced: initialEvent.cityToBeAnnounced,
      scheduleToBeAnnounced: initialEvent.scheduleToBeAnnounced,
      ticketTypesToBeAnnounced: false,
    },
  });

  const { isSubmitting } = form.formState;

  function onSubmit(data: EventInput) {
    startTransition(async () => {
      const result = await updateEventAction(initialEvent.id, data);

      if (!result.success || !result.data) {
        toast.error(result.message);
        return;
      }

      const updatedEvent = result.data;

      if (draftTickets.length) {
        const ticketResults = await Promise.all(
          draftTickets.map((t) =>
            createTicketTypeAction({
              name: t.name,
              price: Number(t.price),
              quantity: Number(t.quantity),
              eventId: updatedEvent.id,
            })
          )
        );

        const failed = ticketResults.filter((r) => !r.success);
        if (failed.length) {
          toast.error(
            `Event updated, but ${failed.length} ticket type(s) failed. You can fix them from the event page.`
          );
        } else {
          toast.success("Ticket types updated successfully");
        }

        setDraftTickets([]);
        router.refresh();
      } else {
        toast.success(result.message);
        router.refresh();
      }
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
            </Field>

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
                          initialCache={initialPerformerCache}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PerformerModal type="create" />
              </FieldGroup>

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
                          initialCache={initialVenueCache}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AddVenueModal />
              </FieldGroup>

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
                {existingTickets.length > 0 && (
                  <div className="bg-muted/40 flex flex-col gap-2 rounded-md border p-3 text-sm">
                    <div className="text-muted-foreground">
                      Existing ticket types for this event:
                    </div>
                    <div className="flex flex-col gap-1">
                      {existingTickets.map((t) => (
                        <div
                          key={t.id}
                          className="bg-background flex items-center justify-between gap-3 rounded border px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-medium">{t.name}</div>
                            <div className="text-muted-foreground">
                              Price: {Number(t.price)} · Qty: {t.quantity}
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <TicketTypeModal
                              mode="update"
                              eventId={t.eventId}
                              ticketType={{
                                id: t.id!,
                                name: t.name,
                                price: Number(t.price),
                                quantity: t.quantity,
                              }}
                              trigger={
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />

                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                startTransition(async () => {
                                  const res = await deleteTicketTypeAction(
                                    t.id!
                                  );

                                  if (!res.success) {
                                    toast.error(res.message);
                                    return;
                                  }

                                  toast.success(res.message);
                                  router.refresh();
                                });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    No ticket types queued to add on save. You can also manage
                    existing ticket types from the event details page.
                  </div>
                )}
              </div>
            </Field>
          </FieldGroup>

          <FieldGroup className="space-y-5">
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
                        defaultImage={initialEvent.coverImage}
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

            <Field>
              <FieldLabel>Event Gallery Images</FieldLabel>
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        {initialEvent.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {initialEvent.images.map((url) => (
                              <div
                                key={url}
                                className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-200"
                              >
                                <Image
                                  urlEndpoint={config.imagekit.url_endpoint}
                                  src={url}
                                  alt="Existing gallery image"
                                  fill
                                  className="object-cover"
                                  transformation={[{ quality: 80 }]}
                                />
                              </div>
                            ))}
                          </div>
                        )}

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
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Field>

            <Field>
              <FieldGroup className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    name: "startAt" as const,
                    label: "Event Start",
                  },
                  {
                    name: "endAt" as const,
                    label: "Event End",
                  },
                ].map((fieldData) => (
                  <Field key={fieldData.name}>
                    <FieldLabel>{fieldData.label}</FieldLabel>

                    <FormField
                      control={form.control}
                      name={fieldData.name}
                      render={({ field }) => {
                        const value = field.value as Date | undefined;

                        return (
                          <FormItem className="grid grid-cols-2 gap-2 md:grid-cols-1">
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
                "Save changes"
              )}
            </div>
          </ActionButton2>
        </div>
      </form>
    </Form>
  );
}
