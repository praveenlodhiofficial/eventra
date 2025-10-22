"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WheelPicker, WheelPickerWrapper, type WheelPickerOption } from "@/components/wheel-picker";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

export interface DateTimeFieldProps<
   TFieldValues extends FieldValues,
   TName extends Path<TFieldValues>,
> {
   control: Control<TFieldValues>;
   name: TName;
   label: string;
   itemClassName?: string;
   labelClassName?: string;
   optionItemHeight?: number;
   visibleCount?: number;
   pickerHeight?: string;
   dragSensitivity?: number;
   scrollSensitivity?: number;
}

export function DateTimeField<TFieldValues extends FieldValues, TName extends Path<TFieldValues>>({
   control,
   name,
   label,
   itemClassName,
   labelClassName,
   optionItemHeight = 40,
   visibleCount = 10,
   pickerHeight = "h-fit",
   dragSensitivity = 5,
   scrollSensitivity = 8,
}: DateTimeFieldProps<TFieldValues, TName>) {
   // Generate date list dynamically (example: 1–31)
   const days = useMemo(
      () =>
         Array.from({ length: 31 }, (_, i) => ({
            value: `${i + 1}`,
            label: `${i + 1}`,
         })),
      []
   );
   const months: WheelPickerOption[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
   ].map((month) => ({ value: month, label: month }));
   const years = useMemo(
      () => {
         const currentYear = new Date().getFullYear();
         return Array.from({ length: 20 }, (_, i) => ({
            value: `${currentYear - 10 + i}`,
            label: `${currentYear - 10 + i}`,
         }));
      },
      []
   );

   // Generate hours (0-23)
   const hours = useMemo(
      () =>
         Array.from({ length: 24 }, (_, i) => ({
            value: `${i.toString().padStart(2, "0")}`,
            label: `${i.toString().padStart(2, "0")}`,
         })),
      []
   );

   // Generate minutes (0-59)
   const minutes = useMemo(
      () =>
         Array.from({ length: 60 }, (_, i) => ({
            value: `${i.toString().padStart(2, "0")}`,
            label: `${i.toString().padStart(2, "0")}`,
         })),
      []
   );

   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => {
            const date = field.value ? new Date(field.value) : new Date();
            const selectedDay = `${date.getDate()}`;
            const selectedMonth = months[date.getMonth()].value;
            const selectedYear = `${date.getFullYear()}`;
            const selectedHour = `${date.getHours().toString().padStart(2, "0")}`;
            const selectedMinute = `${date.getMinutes().toString().padStart(2, "0")}`;

            const handleDateTimeChange = (
               d: string,
               m: string,
               y: string,
               h: string,
               min: string
            ) => {
               const newDate = new Date(`${m} ${d}, ${y} ${h}:${min}:00`);
               field.onChange(newDate);
            };

            return (
               <FormItem className={cn("flex w-full flex-col gap-2", itemClassName)}>
                  <FormLabel
                     className={cn(
                        "ml-0.5 text-xs font-medium text-gray-700 capitalize",
                        labelClassName
                     )}
                  >
                     {label}
                  </FormLabel>

                  <FormControl>
                     <div className="grid grid-cols-[1.3fr_1fr] gap-4">
                        {/* Date Section */}
                        <div>
                           {/* <p className="mb-2 text-xs font-medium text-gray-600">Date</p> */}
                           <WheelPickerWrapper
                              className={cn("flex w-full justify-between gap-2", pickerHeight)}
                           >
                               <WheelPicker
                                  options={days}
                                  value={selectedDay}
                                  onValueChange={(v: string) =>
                                     handleDateTimeChange(
                                        v,
                                        selectedMonth,
                                        selectedYear,
                                        selectedHour,
                                        selectedMinute
                                     )
                                  }
                                  optionItemHeight={optionItemHeight}
                                  visibleCount={visibleCount}
                                  dragSensitivity={dragSensitivity}
                                  scrollSensitivity={scrollSensitivity}
                                  classNames={{
                                     optionItem: "text-zinc-400 dark:text-zinc-500 text-center",
                                     highlightWrapper:
                                        "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 text-center",
                                  }}
                               />
                              <WheelPicker
                                 options={months}
                                 value={selectedMonth}
                                 onValueChange={(v: string) =>
                                    handleDateTimeChange(
                                       selectedDay,
                                       v,
                                       selectedYear,
                                       selectedHour,
                                       selectedMinute
                                    )
                                 }
                                 optionItemHeight={optionItemHeight}
                                 visibleCount={visibleCount}
                                 dragSensitivity={dragSensitivity}
                                 scrollSensitivity={scrollSensitivity}
                                 classNames={{
                                    optionItem: "text-zinc-400 dark:text-zinc-500 text-center",
                                    highlightWrapper:
                                       "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 text-center",
                                 }}
                              />
                              <WheelPicker
                                 options={years}
                                 value={selectedYear}
                                 onValueChange={(v: string) =>
                                    handleDateTimeChange(
                                       selectedDay,
                                       selectedMonth,
                                       v,
                                       selectedHour,
                                       selectedMinute
                                    )
                                 }
                                 optionItemHeight={optionItemHeight}
                                 visibleCount={visibleCount}
                                 dragSensitivity={dragSensitivity}
                                 scrollSensitivity={scrollSensitivity}
                                 classNames={{
                                    optionItem: "text-zinc-400 dark:text-zinc-500 text-center",
                                    highlightWrapper:
                                       "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 text-center",
                                 }}
                              />
                           </WheelPickerWrapper>
                        </div>

                        {/* Time Section */}
                        <div>
                           {/* <p className="mb-2 text-xs font-medium text-gray-600">Time</p> */}
                           <WheelPickerWrapper
                              className={cn("flex w-full justify-center gap-4", pickerHeight)}
                           >
                              <WheelPicker
                                 options={hours}
                                 value={selectedHour}
                                 onValueChange={(v: string) =>
                                    handleDateTimeChange(
                                       selectedDay,
                                       selectedMonth,
                                       selectedYear,
                                       v,
                                       selectedMinute
                                    )
                                 }
                                 optionItemHeight={optionItemHeight}
                                 visibleCount={visibleCount}
                                 dragSensitivity={dragSensitivity}
                                 scrollSensitivity={scrollSensitivity}
                                 classNames={{
                                    optionItem: "text-zinc-400 dark:text-zinc-500 text-center",
                                    highlightWrapper:
                                       "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 text-center",
                                 }}
                              />
                              <span className="flex items-center text-lg font-bold text-gray-500">
                                 :
                              </span>
                              <WheelPicker
                                 options={minutes}
                                 value={selectedMinute}
                                 onValueChange={(v: string) =>
                                    handleDateTimeChange(
                                       selectedDay,
                                       selectedMonth,
                                       selectedYear,
                                       selectedHour,
                                       v
                                    )
                                 }
                                 optionItemHeight={optionItemHeight}
                                 visibleCount={visibleCount}
                                 dragSensitivity={dragSensitivity}
                                 scrollSensitivity={scrollSensitivity}
                                 classNames={{
                                    optionItem: "text-zinc-400 dark:text-zinc-500 text-center",
                                    highlightWrapper:
                                       "bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50 text-center",
                                 }}
                              />
                           </WheelPickerWrapper>
                        </div>
                     </div>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            );
         }}
      />
   );
}

// Backward compatibility export
export const DateField = DateTimeField;
export default DateTimeField;
