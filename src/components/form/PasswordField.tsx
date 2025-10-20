"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

export interface PasswordFieldProps<
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

export function PasswordField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   itemClassName,
   labelClassName,
   inputClassName,
}: PasswordFieldProps<TFieldValues, TName>) {
   const [visible, setVisible] = useState(false);

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
                  <div className="relative w-full">
                     <Input
                        required
                        type={visible ? "text" : "password"}
                        placeholder={placeholder ?? label}
                        {...field}
                        className={cn(
                           "border-gray-200 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0",
                           inputClassName
                        )}
                     />
                     <button
                        type="button"
                        aria-label={visible ? "Hide password" : "Show password"}
                        onClick={() => setVisible((v) => !v)}
                        className="text-muted-foreground absolute inset-y-0 right-0 flex items-center px-3"
                     >
                                                   {visible ? (
                              <IoEyeOff className="h-5 w-5" />
                           ) : (
                              <IoEye className="h-5 w-5" />
                           )}
                     </button>
                  </div>
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default PasswordField;
