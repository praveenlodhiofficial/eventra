"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface TextareaFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   placeholder?: string;
   rows?: number;
   itemClassName?: string;
   labelClassName?: string;
   textareaClassName?: string;
}

export function TextareaField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   rows = 10,
   itemClassName,
   labelClassName,
   textareaClassName,
}: TextareaFieldProps<TFieldValues, TName>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn("flex flex-col gap-1", itemClassName)}>
               <FormLabel
                  className={cn(
                     "ml-0.5 block text-xs font-medium text-gray-700 capitalize",
                     labelClassName
                  )}
               >
                  {label}
               </FormLabel>
               <FormControl>
                  <Textarea
                     placeholder={placeholder ?? label}
                     {...field}
                     rows={rows}
                     className={cn(
                        "w-full rounded-md border border-dashed border-gray-400 bg-transparent px-3 py-2 text-sm transition-all duration-200 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0 active:ring-offset-0",
                        textareaClassName
                     )}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default TextareaField;
