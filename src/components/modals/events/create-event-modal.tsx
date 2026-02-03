"use client";

import { startTransition, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { ActionButton2 } from "@/components/ui/action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Container } from "@/components/ui/container";
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
      name: "",
      slug: "",
      description: "",
      coverImage: "",
      category: [],
      city: "",
      performerIds: [],
      startDate: new Date(),
      endDate: new Date(),
      price: undefined,
      venueId: "",
      imageUrls: [],
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
      <Form {...form}>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Create Event</Button>
          </DialogTrigger>
          <DialogContent className="flex h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden overflow-y-scroll sm:max-w-4xl lg:rounded-3xl">
            <DialogHeader className="h-fit">
              <DialogTitle className="text-center text-xl font-medium uppercase">
                Create Event
              </DialogTitle>
            </DialogHeader>
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
                          className="rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-sm font-light shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                        field.onChange(selected.filter((c) => c !== category));
                      }
                    };

                    return (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-2 gap-3">
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
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
