"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface ReadonlyFieldProps<
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
}

export function ReadonlyField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   itemClassName,
   labelClassName,
   inputClassName,
}: ReadonlyFieldProps<TFieldValues, TName>) {
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
                  <Input
                     placeholder={placeholder ?? label}
                     {...field}
                     value={(field.value as string) ?? ""}
                     disabled
                     className={cn(
                        "w-full cursor-not-allowed rounded-md border border-dashed border-gray-700 bg-gray-100 px-3 py-2 text-sm transition-all duration-200",
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

export default ReadonlyField;
