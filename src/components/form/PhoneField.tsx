"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface PhoneFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   countryCode?: string;
   placeholder?: string;
   itemClassName?: string;
   labelClassName?: string;
   inputClassName?: string;
}

export function PhoneField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   countryCode = "+91",
   placeholder,
   itemClassName,
   labelClassName,
   inputClassName,
}: PhoneFieldProps<TFieldValues, TName>) {
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
                  <div className="flex w-full items-stretch">
                     <span className="rounded-l-md border border-dashed border-gray-400 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 select-none">
                        {countryCode}
                     </span>
                     <Input
                        type="tel"
                        value={field.value as string}
                        onChange={field.onChange}
                        name={String(name)}
                        placeholder={placeholder ?? label}
                        className={cn(
                           "-ml-px w-full rounded-md rounded-l-none border border-dashed border-gray-400 bg-white px-4 py-1.5 text-sm shadow-xs transition-all duration-200 focus:outline-none",
                           inputClassName
                        )}
                     />
                  </div>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default PhoneField;
