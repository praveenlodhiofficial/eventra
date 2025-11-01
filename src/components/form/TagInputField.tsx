"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { Control, FieldValues, Path } from "react-hook-form";
import { TagInput } from "@/components/ui/tag-input";

export interface TagInputFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   placeholder?: string;
   className?: string;
   itemClassName?: string;
   labelClassName?: string;
   addOnBlur?: boolean;
   transform?: (v: string) => string;
   validate?: (v: string) => boolean;
   disabled?: boolean;
}

export function TagInputField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   placeholder,
   className,
   itemClassName,
   labelClassName,
   addOnBlur = true,
   transform,
   validate,
   disabled,
}: TagInputFieldProps<TFieldValues, TName>) {
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
                  <TagInput
                     value={field.value ?? []}
                     onChange={field.onChange}
                     placeholder={placeholder ?? `Add ${label.toLowerCase()}`}
                     className={className}
                     addOnBlur={addOnBlur}
                     transform={transform}
                     validate={validate}
                     disabled={disabled}
                  />
               </FormControl>
               <FormMessage />
            </FormItem>
         )}
      />
   );
}

export default TagInputField;
