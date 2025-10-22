"use client";

import ImageTileUpload from "@/components/ImageTileUpload";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface ImageTileUploadFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   folder: string;
   containerClassName?: string;
   labelClassName?: string;
   fileClassName?: string;
   mediaType?: "image" | "video" | "both";
   placeholder?: string;
   multiple?: boolean;
   type?: "image" | "video" | "file";
}

export function ImageTileUploadField<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
>({
   control,
   name,
   label,
   folder,
   containerClassName,
   labelClassName,
   fileClassName,
   mediaType = "image",
   placeholder,
   multiple = false,
}: ImageTileUploadFieldProps<TFieldValues, TName>) {
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
                  <div className="flex w-full min-w-[310px]">
                     <ImageTileUpload
                        value={field.value}
                        onChange={(value) => {
                           console.log("ImageTileUploadField onChange:", { value, multiple, fieldValue: field.value });
                           if (multiple) {
                              // Ensure we always pass an array for multiple uploads
                              const arrayValue = Array.isArray(value) ? value : (value ? [value] : []);
                              console.log("Setting array value:", arrayValue);
                              field.onChange(arrayValue);
                           } else {
                              field.onChange(value);
                           }
                        }}
                        folder={folder}
                        add={true}
                        multiple={multiple}
                        mediaType={mediaType}
                        placeholder={placeholder ?? `Upload ${label.toLowerCase()}`}
                        className={cn("w-full", fileClassName)}
                     />
                  </div>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default ImageTileUploadField;
