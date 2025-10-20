"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface TextInputFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   placeholder?: string;
   inputClassName?: string;
   itemClassName?: string;
   labelClassName?: string;
   type?: string;
   rightSlot?: ReactNode;
}

export function TextInputField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   inputClassName,
   itemClassName,
   labelClassName,
   type = "text",
   rightSlot,
}: TextInputFieldProps<TFieldValues, TName>) {
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
                  <div className="flex items-center gap-2">
                     <Input
                        type={type}
                        placeholder={placeholder ?? label}
                        {...field}
                        className={cn(
                           "w-full rounded-md border border-dashed border-gray-400 px-3 py-2 text-sm transition-all duration-200",
                           inputClassName
                        )}
                     />
                     {rightSlot}
                  </div>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default TextInputField;
