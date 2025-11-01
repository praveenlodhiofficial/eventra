"use client";

import { ImageUploadField, SelectField, TextareaField, TextInputField } from "@/components/form";
import ImageTileUploadField from "@/components/form/ImageTileUploadField";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { createEvent, deleteEvent, getAllEvents, updateEvent } from "@/features/event";
import { ContributorRole, TicketCategory, TicketType } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Simple type from the actual function return
type EventWithContributors = NonNullable<Awaited<ReturnType<typeof getAllEvents>>["data"]>[0];
type EventWithTickets = NonNullable<Awaited<ReturnType<typeof getAllEvents>>["data"]>[0];
type FormMode = "create" | "update" | "delete";

// Form validation schema
const eventFormSchema = z.object({
   id: z.string().optional(),
   name: z.string().min(1, "Name is required"),
   description: z.string().min(1, "Description is required"),
   tags: z.array(z.string()).default([]),
   startDate: z.date(),
   endDate: z.date(),
   location: z.string().min(1, "Location is required"),
   eventType: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
   ticketType: z.enum(["FREE", "PAID"]),
   coverImageUrl: z.string().optional(),
   imageUrl: z.array(z.string()).default([]),
   contributors: z
      .array(
         z.object({
            name: z.string().min(1, "Name is required"),
            imageUrl: z.string().optional(),
            description: z.string().optional(),
            contributorRole: z.enum(ContributorRole),
         })
      )
      .default([]),
   tickets: z
      .array(
         z.object({
            ticketType: z.enum(TicketType),
            category: z.enum(TicketCategory),
            guidelines: z.string().optional(),
            price: z.coerce.number(),
            quantity: z.coerce.number(),
         })
      )
      .default([]),
   createdAt: z.date().optional(),
   updatedAt: z.date().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;
type TicketFieldPath<K extends "category" | "price" | "quantity" | "guidelines"> =
   `tickets.${number}.${K}`;

// Delete Confirmation Dialog Component
function DeleteEventDialog({
   event,
   open,
   onOpenChange,
   onConfirm,
}: {
   event: Partial<EventWithContributors & EventWithTickets>;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onConfirm: () => void;
}) {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="mb-1 flex items-center gap-2 text-xl">
                  {/* <TrashIcon className="h-5 w-5 text-red-500" /> */}
                  Delete Event
               </DialogTitle>
               <DialogDescription className="text-[13px]">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-black">&quot;{event.name}&quot;</span> ? This
                  action cannot be undone.
               </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
               <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
               </Button>
               <Button variant="destructive" onClick={onConfirm}>
                  Delete
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function AdminEventForm({
   onClose,
   defaultValues,
   onSubmit,
   mode = "create",
}: {
   onClose: () => void;
   defaultValues?: Partial<EventWithContributors & EventWithTickets>;
   onSubmit?: (values: EventFormValues) => Promise<void>;
   mode?: FormMode;
}) {
   const router = useRouter();
   const isUpdateMode = mode === "update";
   const schema = eventFormSchema;

   const formatDateTimeLocal = (date: Date | undefined) => {
      const d = date ? new Date(date) : new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
   };

   const form = useForm<EventFormValues>({
      resolver: zodResolver(schema) as unknown as Resolver<EventFormValues>,
      defaultValues: {
         ...(isUpdateMode && { id: defaultValues?.id ?? "" }),
         name: defaultValues?.name ?? "",
         description: defaultValues?.description ?? "",
         tags: defaultValues?.tags ?? [],
         startDate: defaultValues?.startDate ?? new Date(),
         endDate: defaultValues?.endDate ?? new Date(),
         location: defaultValues?.location ?? "",
         eventType: defaultValues?.eventType ?? "ONLINE",
         ticketType: defaultValues?.ticketType ?? "FREE",
         coverImageUrl: defaultValues?.coverImageUrl ?? "",
         imageUrl: defaultValues?.imageUrl ?? [],
         contributors:
            defaultValues?.contributors?.map(
               (contributor: EventWithContributors["contributors"][0]) => ({
                  name: contributor.name,
                  imageUrl: contributor.imageUrl || undefined,
                  description: contributor.description || undefined,
                  contributorRole: contributor.contributorRole,
               })
            ) ?? [],
         tickets:
            defaultValues?.ticket?.map((ticket: EventWithTickets["ticket"][0]) => ({
               ticketType: ticket.ticketType,
               category: ticket.category,
               guidelines: ticket.guidelines || undefined,
               price: ticket.price,
               quantity: ticket.quantity,
            })) ?? [],
         ...(isUpdateMode && {
            createdAt: defaultValues?.createdAt ?? new Date(),
            updatedAt: defaultValues?.updatedAt ?? new Date(),
         }),
      },
   });

   const contributorsFieldArray = useFieldArray({
      control: form.control,
      name: "contributors",
      keyName: "id",
   });

   const ticketsFieldArray = useFieldArray({
      control: form.control,
      name: "tickets",
      keyName: "id",
   });

   const { isDirty } = form.formState;
   const watchedImageUrl = form.watch("imageUrl");
   const watchedTicketType = form.watch("ticketType");
   console.log("Form imageUrl value:", watchedImageUrl);

   async function handleSubmit(data: EventFormValues) {
      if (onSubmit) {
         await onSubmit(data);
         return;
      }

      try {
         let result;

         if (isUpdateMode && "id" in data) {
            // Update existing event
            result = await updateEvent({
               id: data.id!,
               data: {
                  name: data.name,
                  description: data.description,
                  tags: data.tags,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  location: data.location,
                  eventType: data.eventType,
                  ticketType: data.ticketType,
                  coverImageUrl: data.coverImageUrl || null,
                  imageUrl: data.imageUrl || [],
                  contributors: data.contributors || [],
                  tickets: data.tickets || [],
               },
            });
         } else {
            // Create new event
            result = await createEvent({
               name: data.name,
               description: data.description,
               tags: data.tags,
               startDate: data.startDate,
               endDate: data.endDate,
               location: data.location,
               eventType: data.eventType,
               ticketType: data.ticketType,
               coverImageUrl: data.coverImageUrl || null,
               imageUrl: data.imageUrl || [],
               contributors: (data as EventFormValues).contributors || [],
               tickets: (data as EventFormValues).tickets || [],
            });
         }

         if (result.success) {
            toast.success(result.message);
            form.reset(data);
            onClose();
            router.refresh();
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.error(`Error ${isUpdateMode ? "updating" : "creating"} event`, error);
         toast.error(
            error instanceof Error ? error.message : "Something went wrong! Please try again."
         );
      }
   }

   return (
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-xs">
         <motion.div
            className="relative flex h-[calc(100vh-4rem)] w-7xl flex-col gap-5 overflow-hidden rounded-xl bg-white p-2 shadow-xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
         >
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-6 bg-transparent p-5"
               >
                  {/* Event Section */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                     <div className="relative flex items-end">
                        <h1 className="absolute -bottom-2 -left-1.5 z-15 bg-gradient-to-t from-transparent via-zinc-100 to-zinc-300 bg-clip-text text-[3rem] font-semibold text-transparent md:text-[5rem]">
                           Event
                        </h1>
                        <h1 className="relative z-20 text-[1.5rem] font-semibold md:text-[3rem]">
                           Event
                        </h1>
                     </div>
                     <div className="flex gap-3">
                        <Button
                           type="submit"
                           disabled={!isDirty}
                           className="hidden w-fit bg-black text-white disabled:cursor-not-allowed disabled:bg-gray-400 md:block"
                        >
                           {isUpdateMode ? "Update Event" : "Create Event"}
                        </Button>
                        <Button
                           variant="secondary"
                           //  className="absolute top-2 right-2"
                           onClick={onClose}
                        >
                           <XIcon className="size-5" />
                        </Button>
                     </div>
                  </div>
                  {/* Event Details */}
                  <div className="scrollbar-hide grid max-h-[calc(100vh-14rem)] w-full grid-cols-1 gap-5 overflow-y-auto lg:grid-cols-[1fr_auto] lg:gap-10">
                     {/* Left Side */}
                     <div className="flex flex-col gap-5">
                        {/* Name */}
                        <TextInputField
                           control={form.control}
                           name={"name"}
                           label="Name"
                           placeholder="Name"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                        />

                        {/* Tags */}
                        <FormField
                           control={form.control}
                           name="tags"
                           render={({ field }) => (
                              <FormItem>
                                 <FormLabel>Tags</FormLabel>
                                 <FormControl>
                                    <TagInput
                                       value={field.value ?? []}
                                       onChange={field.onChange}
                                       placeholder="Add tags (press Enter or comma)"
                                       className="w-full"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
                           {/* Location */}
                           <TextInputField
                              control={form.control}
                              name={"location"}
                              label="Location"
                              placeholder="Location"
                              inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                           />

                           {/* Event Type */}
                           <SelectField
                              control={form.control}
                              name={"eventType"}
                              label="Event Type"
                              placeholder="Event Type"
                              options={[
                                 { label: "Online", value: "ONLINE" },
                                 { label: "Offline", value: "OFFLINE" },
                                 { label: "Hybrid", value: "HYBRID" },
                              ]}
                              selectClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                           />

                           {/* Ticket Type */}
                           <SelectField
                              control={form.control}
                              name={"ticketType"}
                              label="Ticket Type"
                              placeholder="Ticket Type"
                              options={[
                                 { label: "Free", value: "FREE" },
                                 { label: "Paid", value: "PAID" },
                              ]}
                              selectClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                           />
                        </div>

                        {/* Description */}
                        <TextareaField
                           control={form.control}
                           name={"description"}
                           label="Description"
                           placeholder="Description"
                           rows={9}
                           textareaClassName="w-full rounded-md border border-dashed border-gray-400 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                        />

                        {/* Event Images Section */}
                        <div className="flex flex-col gap-3">
                           <ImageTileUploadField
                              control={form.control}
                              name="imageUrl"
                              label="Event Images"
                              folder="eventra/events"
                              type="image"
                              multiple={true}
                           />
                        </div>

                        {watchedTicketType === "PAID" && (
                           <div className="mt-2 flex flex-col gap-3">
                              <div className="flex items-center justify-between">
                                 <h3 className="text-lg font-semibold">Tickets</h3>
                                 <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                       ticketsFieldArray.append({
                                          ticketType: "PAID",
                                          category: "REGULAR",
                                          guidelines: "",
                                          price: 0,
                                          quantity: 0,
                                       })
                                    }
                                 >
                                    <PlusIcon className="mr-2 size-4" /> Add Ticket
                                 </Button>
                              </div>

                              {ticketsFieldArray.fields.length === 0 ? (
                                 <p className="text-muted-foreground text-sm">No tickets added.</p>
                              ) : null}

                              <div className="flex flex-col gap-4">
                                 {ticketsFieldArray.fields.map((field, index) => (
                                    <div
                                       key={field.id}
                                       className="rounded-md border border-dashed p-3"
                                    >
                                       <div className="mb-2 flex items-center justify-between">
                                          <span className="text-sm font-medium">
                                             Ticket {index + 1}
                                          </span>
                                          <Button
                                             type="button"
                                             variant="ghost"
                                             onClick={() => ticketsFieldArray.remove(index)}
                                             className="size-8 hover:bg-red-50"
                                          >
                                             <TrashIcon className="size-4 text-red-500" />
                                          </Button>
                                       </div>

                                       <div className="flex flex-col gap-3">
                                          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                             <SelectField
                                                control={form.control}
                                                name={
                                                   `tickets.${index}.category` as TicketFieldPath<"category">
                                                }
                                                label="Category"
                                                placeholder="Select category"
                                                options={Object.values(TicketCategory).map((c) => ({
                                                   label: (c as string)
                                                      .toLowerCase()
                                                      .replace(/_/g, " ")
                                                      .replace(/\b\w/g, (ch) => ch.toUpperCase()),
                                                   value: c as string,
                                                }))}
                                             />
                                             <TextInputField
                                                control={form.control}
                                                name={
                                                   `tickets.${index}.price` as TicketFieldPath<"price">
                                                }
                                                label="Price"
                                                type="number"
                                                placeholder="0.00"
                                             />
                                             <TextInputField
                                                control={form.control}
                                                name={
                                                   `tickets.${index}.quantity` as TicketFieldPath<"quantity">
                                                }
                                                label="Quantity"
                                                type="number"
                                                placeholder="0"
                                             />
                                          </div>

                                          <TextareaField
                                             control={form.control}
                                             name={
                                                `tickets.${index}.guidelines` as TicketFieldPath<"guidelines">
                                             }
                                             label="Guidelines"
                                             placeholder="Any ticket guidelines"
                                             rows={4}
                                             textareaClassName="w-full rounded-md border border-dashed border-gray-400 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0"
                                          />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Right Side */}
                     <div className="flex w-full flex-col space-y-5 md:flex-row lg:w-[450px] lg:flex-col">
                        {/* Cover Image Upload */}
                        <ImageUploadField
                           control={form.control}
                           name="coverImageUrl"
                           label="Upload Cover Image"
                           folder="eventra/events"
                           fileClassName="w-full h-fit rounded-md text-sm transition-all duration-200"
                        />

                        <div className="flex items-center justify-between gap-5">
                           {/* Start Date */}
                           {/* <DateField
                              control={form.control}
                              name={"startDate"}
                              label="Start Date and Time"
                              dragSensitivity={20}
                              scrollSensitivity={20}
                           /> */}

                           <FormField
                              control={form.control}
                              name={"startDate"}
                              render={({ field }) => (
                                 <FormItem className="w-full">
                                    <FormLabel className="text-xs font-medium text-gray-700 capitalize">
                                       Start Date and Time
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          type="datetime-local"
                                          value={
                                             field.value ? formatDateTimeLocal(field.value) : ""
                                          }
                                          onChange={(e) => field.onChange(new Date(e.target.value))}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />

                           {/* End Date */}
                           {/* <DateField
                              control={form.control}
                              name={"endDate"}
                              label="End Date and Time"
                              dragSensitivity={20}
                              scrollSensitivity={15}
                           /> */}

                           <FormField
                              control={form.control}
                              name={"endDate"}
                              render={({ field }) => (
                                 <FormItem className="w-full">
                                    <FormLabel className="text-xs font-medium text-gray-700 capitalize">
                                       End Date and Time
                                    </FormLabel>
                                    <FormControl>
                                       <Input
                                          type="datetime-local"
                                          value={
                                             field.value ? formatDateTimeLocal(field.value) : ""
                                          }
                                          onChange={(e) => field.onChange(new Date(e.target.value))}
                                       />
                                    </FormControl>
                                    <FormMessage />
                                 </FormItem>
                              )}
                           />
                        </div>

                        {/* Contributors Section */}
                        <div className="mt-10 flex flex-col gap-3">
                           <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">Contributors</h3>
                              <Button
                                 type="button"
                                 variant="secondary"
                                 onClick={() =>
                                    contributorsFieldArray.append({
                                       name: "",
                                       imageUrl: "",
                                       description: "",
                                       contributorRole: "ARTIST",
                                    })
                                 }
                              >
                                 <PlusIcon className="mr-2 size-4" /> Add Contributor
                              </Button>
                           </div>

                           {contributorsFieldArray.fields.length === 0 ? (
                              <p className="text-muted-foreground text-sm">
                                 No contributors added.
                              </p>
                           ) : null}

                           <div className="flex flex-col gap-4">
                              {contributorsFieldArray.fields.map((field, index) => (
                                 <div
                                    key={field.id}
                                    className="rounded-md border border-dashed p-3"
                                 >
                                    <div className="mb-2 flex items-center justify-between">
                                       <span className="text-sm font-medium">
                                          Contributor {index + 1}
                                       </span>
                                       <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => contributorsFieldArray.remove(index)}
                                          className="size-8 hover:bg-red-50"
                                       >
                                          <TrashIcon className="size-4 text-red-500" />
                                       </Button>
                                    </div>

                                    <div className="grid grid-cols-[auto_1fr] gap-3 md:gap-4">
                                       {/* Left: Large Image Area */}
                                       <div className="rounded-md md:pr-1">
                                          <ImageUploadField
                                             control={form.control}
                                             name={`contributors.${index}.imageUrl`}
                                             label="Image"
                                             folder="eventra/contributors"
                                             aspectRatio="1:1"
                                             fileClassName="aspect-square w-26.5"
                                          />
                                       </div>

                                       {/* Right: Stacked fields */}
                                       <div className="flex flex-col gap-3">
                                          <TextInputField
                                             control={form.control}
                                             name={`contributors.${index}.name`}
                                             label="Name"
                                             placeholder="e.g., John Doe"
                                          />

                                          <SelectField
                                             control={form.control}
                                             name={`contributors.${index}.contributorRole`}
                                             label="Role"
                                             placeholder="Select role"
                                             options={Object.values(ContributorRole).map((r) => ({
                                                label: (r as string)
                                                   .toLowerCase()
                                                   .replace(/_/g, " ")
                                                   .replace(/\b\w/g, (c) => c.toUpperCase()),
                                                value: r as string,
                                             }))}
                                          />
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Mobile Submit Button */}
                  <Button
                     type="submit"
                     disabled={!isDirty}
                     className="w-full bg-black text-white disabled:cursor-not-allowed disabled:bg-gray-400 md:hidden"
                  >
                     {isUpdateMode ? "Update Event" : "Create Event"}
                  </Button>
               </form>
            </Form>
         </motion.div>
      </div>
   );
}

export function EventFormModalButton({
   defaultValues,
   mode = "create",
   buttonText,
   buttonIcon: ButtonIcon = PlusIcon,
}: {
   defaultValues?: Partial<EventWithContributors & EventWithTickets>;
   mode?: FormMode;
   buttonText?: string;
   buttonIcon?: React.ComponentType<{ className?: string }>;
}) {
   const [openModal, setOpenModal] = useState(false);
   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
   const router = useRouter();
   const isUpdateMode = mode === "update";
   const isDeleteMode = mode === "delete";

   async function handleDelete() {
      if (!defaultValues?.id) {
         toast.error("Event ID is required for deletion");
         return;
      }

      try {
         const result = await deleteEvent({ id: defaultValues.id });

         if (result.success) {
            toast.success(result.message);
            setOpenDeleteDialog(false);
            router.refresh();
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.error("Error deleting event", error);
         toast.error(
            error instanceof Error ? error.message : "Something went wrong! Please try again."
         );
      }
   }

   return (
      <div>
         {isUpdateMode ? (
            <>
               <Button
                  variant="ghost"
                  onClick={() => setOpenModal(true)}
                  className="size-8 hover:bg-green-100"
               >
                  <PencilIcon className="size-4 text-green-500" />
               </Button>

               {openModal && (
                  <AdminEventForm
                     defaultValues={defaultValues}
                     onClose={() => setOpenModal(false)}
                     mode="update"
                  />
               )}
            </>
         ) : isDeleteMode ? (
            <>
               <Button
                  variant="ghost"
                  onClick={() => setOpenDeleteDialog(true)}
                  className="size-8 hover:bg-red-100"
               >
                  <TrashIcon className="size-4 text-red-500" />
               </Button>

               <DeleteEventDialog
                  event={defaultValues || {}}
                  open={openDeleteDialog}
                  onOpenChange={setOpenDeleteDialog}
                  onConfirm={handleDelete}
               />
            </>
         ) : (
            <>
               <Button variant="default" onClick={() => setOpenModal(true)} className="w-35">
                  <ButtonIcon className="size-4" />
                  {buttonText || "Add Event"}
               </Button>

               {openModal && (
                  <AdminEventForm
                     defaultValues={defaultValues}
                     onClose={() => setOpenModal(false)}
                     mode="create"
                  />
               )}
            </>
         )}
      </div>
   );
}
