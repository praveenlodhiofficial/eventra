"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DefaultValues, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { IoClose } from "react-icons/io5";

interface EventFormProps<T extends FieldValues> {
   schema: z.ZodSchema<T>;
   defaultValues: T;
   onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
   type: "CREATE" | "UPDATE";
   isOverlay?: boolean;
   onClose?: () => void;
}

export function EventForm<T extends FieldValues>({
   schema,
   defaultValues,
   onSubmit,
   type,
   isOverlay,
   onClose,
}: EventFormProps<T>) {
   const router = useRouter();
   const isCreate = type === "CREATE";
   const [isLoading, setIsLoading] = useState(false);

   const form = useForm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolver: zodResolver(schema as any) as any,
      defaultValues: defaultValues as DefaultValues<T>,
   });

   const handleSubmit: SubmitHandler<T> = async (data) => {
      setIsLoading(true);

      try {
         const result = await onSubmit(data);
         if (result.success) {
            toast.success(isCreate ? "Event created successfully" : "Event updated successfully", {
               description: isCreate ? "Event created successfully" : "Event updated successfully",
            });

            // Close overlay or redirect
            if (isOverlay && onClose) {
               onClose();
            } else {
               router.push("/admin/events");
            }
         } else {
            toast.error(isCreate ? "Event creation failed" : "Event update failed", {
               description: result.error || "Please try again.",
            });
         }
      } catch (error) {
         console.error("Error submitting event form", error);
         toast.error(isCreate ? "Event creation failed" : "Event update failed", {
            description: "Please try again.",
         });
      } finally {
         setIsLoading(false);
      }
   };

   if (isOverlay) {
      return (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background scrollbar-hide relative mx-4 max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border shadow-lg">
               <div className="relative flex items-center justify-between border-b px-6 pt-6 pb-4">
                  <div className="relative flex flex-col gap-1">
                     <h1 className="absolute -top-18 -left-1.5 z-[-1] bg-gradient-to-t from-transparent via-zinc-100 to-zinc-300 bg-clip-text text-[7rem] font-semibold text-transparent">
                        {isCreate ? "Create New Event" : "Update Event"}
                     </h1>
                     <h1 className="relative text-[4rem] font-semibold">
                        {isCreate ? "Create New Event" : "Update Event"}
                     </h1>
                  </div>
                  <p className="text-muted-foreground text-xs text-[13px]">
                     {isCreate
                        ? "Fill in the details to create a new event"
                        : "Update the event information"}
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <Button
                     type="submit"
                     loading={isLoading}
                     className="bg-black text-white hover:bg-gray-800"
                     onClick={form.handleSubmit(handleSubmit)}
                  >
                     {isCreate ? "Create Event" : "Update Event"}
                  </Button>
                  {onClose && (
                     <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close"
                     >
                        <IoClose className="text-muted-foreground hover:text-foreground size-6 transition-colors" />
                     </button>
                  )}
               </div>
            </div>
         </div>
      );
   }
}
