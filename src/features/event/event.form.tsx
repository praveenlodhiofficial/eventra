"use client";

import {
   DateField,
   ImageUploadField,
   SelectField,
   TextareaField,
   TextInputField,
} from "@/components/form";
import ImageTileUploadField from "@/components/form/ImageTileUploadField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createEvent, updateEvent } from "@/features/event";
import {
   eventCreateSchema,
   EventCreateSchema,
   eventSchema,
   EventSchema,
} from "@/features/event/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon, PlusIcon, XIcon } from "lucide-react";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormMode = "create" | "update";

function AdminEventForm({
   onClose,
   defaultValues,
   onSubmit,
   mode = "create",
}: {
   onClose: () => void;
   defaultValues?: Partial<EventSchema>;
   onSubmit?: (values: EventSchema | EventCreateSchema) => Promise<void>;
   mode?: FormMode;
}) {
   const router = useRouter();
   const isUpdateMode = mode === "update";
   const schema = isUpdateMode ? eventSchema : eventCreateSchema;

   const form = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
         ...(isUpdateMode && { id: defaultValues?.id ?? "" }),
         name: defaultValues?.name ?? "",
         description: defaultValues?.description ?? "",
         startDate: defaultValues?.startDate ?? new Date(),
         endDate: defaultValues?.endDate ?? new Date(),
         location: defaultValues?.location ?? "",
         eventType: defaultValues?.eventType ?? "ONLINE",
         ticketType: defaultValues?.ticketType ?? "FREE",
         coverImageUrl: defaultValues?.coverImageUrl ?? "",
         imageUrl: defaultValues?.imageUrl ?? [],
         ...(isUpdateMode && {
            createdAt: defaultValues?.createdAt ?? new Date(),
            updatedAt: defaultValues?.updatedAt ?? new Date(),
         }),
      },
   });

   const { isDirty } = form.formState;
   const watchedImageUrl = form.watch("imageUrl");
   console.log("Form imageUrl value:", watchedImageUrl);

   async function handleSubmit(data: EventSchema | EventCreateSchema) {
      if (onSubmit) {
         await onSubmit(data);
         return;
      }

      try {
         let result;

         if (isUpdateMode && "id" in data) {
            // Update existing event
            result = await updateEvent({
               id: data.id,
               name: data.name,
               description: data.description,
               startDate: data.startDate,
               endDate: data.endDate,
               location: data.location,
               eventType: data.eventType,
               ticketType: data.ticketType,
               coverImageUrl: data.coverImageUrl || null,
               imageUrl: data.imageUrl || [],
            });
         } else {
            // Create new event
            result = await createEvent({
               name: data.name,
               description: data.description,
               startDate: data.startDate,
               endDate: data.endDate,
               location: data.location,
               eventType: data.eventType,
               ticketType: data.ticketType,
               coverImageUrl: data.coverImageUrl || null,
               imageUrl: data.imageUrl || [],
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
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
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
                     </div>

                     {/* Right Side */}
                     <div className="flex w-full flex-col gap-5 md:flex-row lg:w-[450px] lg:flex-col">
                        {/* Cover Image Upload */}
                        <ImageUploadField
                           control={form.control}
                           name="coverImageUrl"
                           label="Cover Image"
                           folder="eventra/events"
                           fileClassName="w-full rounded-md text-sm transition-all duration-200"
                        />

                        <div className="space-y-5">
                           {/* Start Date */}
                           <DateField
                              control={form.control}
                              name={"startDate"}
                              label="Start Date and Time"
                              dragSensitivity={20}
                              scrollSensitivity={15}
                           />

                           {/* End Date */}
                           <DateField
                              control={form.control}
                              name={"endDate"}
                              label="End Date and Time"
                              dragSensitivity={20}
                              scrollSensitivity={15}
                           />
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
   defaultValues?: Partial<EventSchema>;
   mode?: FormMode;
   buttonText?: string;
   buttonIcon?: React.ComponentType<{ className?: string }>;
}) {
   const [openModal, setOpenModal] = useState(false);
   const isUpdateMode = mode === "update";

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
