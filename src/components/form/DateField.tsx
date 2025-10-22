"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface DateFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   placeholder?: string;
   itemClassName?: string;
   labelClassName?: string;
   inputClassName?: string;
   type?: "date" | "datetime-local";
}

export function DateField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   itemClassName,
   labelClassName,
   inputClassName,
   type = "datetime-local",
}: DateFieldProps<TFieldValues, TName>) {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <FormItem className={cn("flex w-full flex-col gap-1", itemClassName)}>
               <FormLabel
                  className={cn(
                     "ml-0.5 block text-xs font-medium text-gray-700 capitalize",
                     labelClassName
                  )}
               >
                  {label}
               </FormLabel>
               <FormControl>
                  <input
                     type={type}
                     placeholder={placeholder ?? label}
                     {...field}
                     value={
                        field.value
                           ? new Date(
                                field.value.getTime() - field.value.getTimezoneOffset() * 60000
                             )
                                .toISOString()
                                .slice(0, 16)
                           : ""
                     }
                     onChange={(e) => field.onChange(new Date(e.target.value))}
                     className={cn(
                        "w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200",
                        inputClassName
                     )}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default DateField;
