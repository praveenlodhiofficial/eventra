"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface SelectFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   placeholder?: string;
   options: { value: string; label: string }[];
   itemClassName?: string;
   labelClassName?: string;
   selectClassName?: string;
}

export function SelectField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   options,
   itemClassName,
   labelClassName,
   selectClassName,
}: SelectFieldProps<TFieldValues, TName>) {
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
               <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                     <SelectTrigger
                        className={cn(
                           "w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200",
                           selectClassName
                        )}
                     >
                        <SelectValue placeholder={placeholder ?? `Select ${label.toLowerCase()}`} />
                     </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                     {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                           {option.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default SelectField;
