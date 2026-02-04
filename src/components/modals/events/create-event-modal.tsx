"use client";

import { startTransition } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

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
import { CoverImageUpload } from "@/components/upload/CoverImageUpload";
import { GalleryImageUpload } from "@/components/upload/GalleryImageUpload";
import { CreateEventAction } from "@/domains/event/event.actions";
import {
  EventCategoryEnum,
  EventInput,
  EventSchema,
} from "@/domains/event/event.schema";

export const EventCategoryLabels: Record<EventCategoryEnum, string> = {
  MUSIC: "Music",
  COMEDY: "Comedy",
  SPORTS: "Sports",
  THEATRE: "Theatre",
  CONFERENCE: "Conference",
  FITNESS: "Fitness",
  EXHIBITION: "Exhibition",
  FEST: "Fest",
  SOCIAL: "Social",
};

export function CreateEventModal() {
  const router = useRouter();

  const form = useForm<EventInput>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      name: "Sunburn Goa 2026",
      slug: "sunburn-goa-2026",
      description:
        "Asia’s biggest electronic music festival returns to Goa with world-class DJs, immersive stages, and an unforgettable beachside experience.",

      coverImage:
        "https://images.unsplash.com/photo-1506157786151-b8491531f063",

      category: ["MUSIC", "FEST"],

      city: "Goa",

      performerIds: ["perf_alanwalker", "perf_martingarrix", "perf_djchetas"],

      startDate: new Date("2026-12-27T16:00:00"),
      endDate: new Date("2026-12-29T23:00:00"),

      price: 4999,

      venueId: "venue_baga_beach",

      imageUrls: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
        "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
      ],
    },
  });

  function onSubmit(data: EventInput) {
    startTransition(async () => {
      const result = await CreateEventAction(data);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.push("/events");
      form.reset();
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Event</Button>
      </DialogTrigger>
      <DialogContent className="h-[calc(100vh-10rem)] md:max-w-3xl lg:max-w-5xl lg:rounded-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 overflow-hidden overflow-y-scroll"
          >
            <DialogHeader className="flex h-fit items-center justify-center">
              <DialogTitle className="border-primary w-fit border-y-2 px-5 py-1 text-center text-xl font-semibold uppercase">
                Create Event
              </DialogTitle>
              <DialogDescription className="sr-only">
                Provide the required information to list a new event on the
                platform.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup className="grid md:grid-cols-[2fr_1fr]">
              <FieldGroup>
                {/* ================================== Name Input ================================== */}
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
                            className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ================================== Slug Input ================================== */}
                <Field>
                  <FieldLabel>Event Slug</FieldLabel>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Event Slug"
                            className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ================================== Description Input ================================== */}
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
                            rows={5}
                            aria-multiline="true"
                            className="rounded-lg border border-zinc-200 bg-white/10 p-3 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ================================== Category Input ================================== */}
                <Field>
                  <FieldLabel>Event Category</FieldLabel>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      const selected: EventCategoryEnum[] = field.value ?? [];

                      const toggleCategory = (
                        category: EventCategoryEnum,
                        checked: boolean
                      ) => {
                        if (checked) {
                          field.onChange([...selected, category]);
                        } else {
                          field.onChange(
                            selected.filter((c) => c !== category)
                          );
                        }
                      };

                      return (
                        <FormItem>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                              {EventCategoryEnum.options.map((category) => {
                                const isChecked = selected.includes(category);

                                return (
                                  <FormItem
                                    key={category}
                                    className="flex items-center space-y-0 space-x-3 rounded-md border p-3"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                          toggleCategory(
                                            category,
                                            Boolean(checked)
                                          )
                                        }
                                      />
                                    </FormControl>

                                    <FormLabel className="cursor-pointer font-normal">
                                      {EventCategoryLabels[category]}
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

                {/* ==================================== City Input ==================================== */}
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
                            className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ==================================== Start Date Input ==================================== */}
                <Field>
                  <FieldLabel>Event Start Date</FieldLabel>

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="justify-start rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-left text-sm font-light shadow-none"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select start date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ==================================== End Date Input ==================================== */}
                <Field>
                  <FieldLabel>Event End Date</FieldLabel>

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="justify-start rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-left text-sm font-light shadow-none"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Select end date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < form.getValues("startDate")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ==================================== Price Input ==================================== */}
                <Field>
                  <FieldLabel>Event Price</FieldLabel>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Event Price"
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

              <FieldGroup>
                {/* ================================== Cover Image Upload ================================== */}
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
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>

                {/* ================================== Gallery Images Upload ================================== */}
                <Field>
                  <FieldLabel>Event Gallery Images</FieldLabel>
                  <FormField
                    control={form.control}
                    name="imageUrls"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <GalleryImageUpload
                            folder="eventra/events"
                            onUploaded={(url) =>
                              field.onChange([...(field.value || []), url])
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>

            <DialogFooter className="grid grid-cols-2 gap-5">
              <DialogClose asChild>
                <ActionButton2 variant="outline">Cancel</ActionButton2>
              </DialogClose>
              <ActionButton2 type="submit">Save changes</ActionButton2>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
