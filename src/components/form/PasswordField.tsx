"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

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
                        {/* simple eye icon via svg to avoid extra deps */}
                        {visible ? (
                           <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           >
                              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.63-1.44 1.6-2.78 2.78-3.94M22.94 11.94C22.36 10.64 21.59 9.44 20.66 8.39M1 1l22 22" />
                           </svg>
                        ) : (
                           <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                           >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                           </svg>
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
