"use client";

import {
   DateField,
   ImageUploadField,
   SelectField,
   TextareaField,
   TextInputField,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateEvent } from "@/features/event";
import { eventSchema, EventSchema } from "@/features/event/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as motion from "motion/react-client";

function AdminEventForm({
   open,
   onClose,
   defaultValues,
   onSubmit,
}: {
   open: boolean;
   onClose: () => void;
   defaultValues?: Partial<EventSchema>;
   onSubmit?: (values: EventSchema) => Promise<void>;
}) {
   const form = useForm<EventSchema>({
      resolver: zodResolver(eventSchema),
      defaultValues: {
         id: defaultValues?.id ?? "",
         name: defaultValues?.name ?? "",
         description: defaultValues?.description ?? "",
         startDate: defaultValues?.startDate ?? new Date(),
         endDate: defaultValues?.endDate ?? new Date(),
         location: defaultValues?.location ?? "",
         eventType: defaultValues?.eventType ?? "ONLINE",
         ticketType: defaultValues?.ticketType ?? "FREE",
         createdAt: defaultValues?.createdAt ?? new Date(),
         updatedAt: defaultValues?.updatedAt ?? new Date(),
      },
   });

   const { isDirty } = form.formState;

   async function handleSubmit(data: EventSchema) {
      if (onSubmit) {
         await onSubmit(data);
         return;
      }

      try {
         const result = await updateEvent({
            id: data.id,
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            location: data.location,
            eventType: data.eventType,
            ticketType: data.ticketType,
         });

         if (result.success) {
            toast.success(result.message);
            form.reset(data);
         } else {
            toast.error(result.message);
         }
      } catch (error) {
         console.error("Error updating event", error);
         toast.error(
            error instanceof Error ? error.message : "Something went wrong! Please try again."
         );
      }
   }

   return (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-xs z-10">
      <motion.div 
            className="overflow-hidden bg-white shadow-xl shadow-black/50 w-7xl h-[calc(100vh-4rem)] flex flex-col gap-5 p-2 rounded-xl relative"
         initial={{ opacity: 0, scale: 0.5 }}
         animate={{ opacity: 1, scale: 1, }}
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
                     Update Event
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
               <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[1fr_auto] lg:gap-10">
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
                  </div>

                  {/* Right Side */}
                  <div className="flex w-full flex-col gap-5 md:flex-row lg:w-[450px] lg:flex-col">
                     {/* Event Image Upload */}
                     <ImageUploadField
                        control={form.control}
                        name={"image" as keyof EventSchema}
                        label="Event Image"
                        folder="events"
                        fileClassName="w-full rounded-md text-sm transition-all duration-200"
                     />

                     <div className="grid grid-cols-2 gap-5">
                        {/* Start Date */}
                        <DateField
                           control={form.control}
                           name={"startDate"}
                           label="Start Date"
                           placeholder="Start Date"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
                        />

                        {/* End Date */}
                        <DateField
                           control={form.control}
                           name={"endDate"}
                           label="End Date"
                           placeholder="End Date"
                           inputClassName="w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200"
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
                  Update Event
               </Button>
            </form>
         </Form>
      </motion.div>
      </div>
   );
}

export function EventFormModalButton({defaultValues}: {defaultValues?: Partial<EventSchema>}) {
    const [openModal, setOpenModal] = useState(false);
   return (
      <div>
                     {/* Event Section */}
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="relative flex items-end">
                     <h1 className="absolute -bottom-2 -left-1.5 z-[-1] bg-gradient-to-t from-transparent via-zinc-100 to-zinc-300 bg-clip-text text-[3rem] font-semibold text-transparent md:text-[5rem]">
                        Event
                     </h1>
                     <h1 className="relative text-[1.5rem] font-semibold md:text-[3rem]">
                        Event
                     </h1>
                  </div>
                  {/* Submit Button */}
            <Button
               variant="default"
               onClick={() => setOpenModal(true)}
               className="px-3"
            >
               <PlusIcon className="size-4" />
                     Add Event
            </Button>
            {openModal && <AdminEventForm defaultValues={defaultValues}  open={openModal} onClose={() => setOpenModal(false)}  />}
               </div>
      </div>
   )
}