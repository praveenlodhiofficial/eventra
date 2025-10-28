"use client";

import FileUpload from "@/components/FileUpload";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface ImageUploadFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   folder: string;
   accept?: string;
   aspectRatio?: "16:9" | "4:3" | "1:1" | "9:16";
   containerClassName?: string;
   labelClassName?: string;
   fileClassName?: string;
   type?: "image" | "video" | "file";
}

export function ImageUploadField<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
>({
   control,
   name,
   label,
   folder,
   accept = "image/*",
   aspectRatio = "16:9",
   containerClassName,
   labelClassName,
   fileClassName,
   type = "image",
}: ImageUploadFieldProps<TFieldValues, TName>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn("flex flex-col gap-1", containerClassName)}>
               <FormLabel
                  className={cn(
                     "ml-0.5 block text-xs font-medium text-gray-700 capitalize",
                     labelClassName
                  )}
               >
                  {label}
               </FormLabel>
               <FormControl>
                  {/* <div className="flex aspect-video w-full max-w-[450px] min-w-[310px] items-center rounded-md border border-dashed border-gray-400"> */}
                  <FileUpload
                     type={type}
                     accept={accept}
                     placeholder={`Upload ${label.toLowerCase()}`}
                     folder={folder}
                     onFileChange={field.onChange}
                     value={field.value}
                     aspectRatio={aspectRatio}
                     className={cn(
                        // "aspect-video h-full max-w-[450px] min-w-[310px] rounded-md border border-dashed border-gray-400 object-cover",
                        "aspect-video h-full max-w-[450px] min-w-[250px] rounded-md border border-dashed border-gray-400 object-cover",
                        fileClassName
                     )}
                  />
                  {/* </div> */}
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default ImageUploadField;
