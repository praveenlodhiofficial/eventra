"use client";

import React, { useEffect, useState } from "react";

import type { WheelPickerOption } from "@ncdai/react-wheel-picker";
import { WheelPicker, WheelPickerWrapper } from "@ncdai/react-wheel-picker";

const createArray = (length: number, add = 0): WheelPickerOption<number>[] =>
  Array.from({ length }, (_, i) => {
    const value = i + add;
    return {
      label: value.toString().padStart(2, "0"),
      value,
    };
  });

const hourOptions = createArray(12, 1);
const minuteOptions = createArray(60);
const meridiemOptions: WheelPickerOption<string>[] = [
  { label: "AM", value: "AM" },
  { label: "PM", value: "PM" },
];

export function WheelTimePicker({
  valueDate,
  onChange,
}: {
  valueDate: Date | null;
  onChange: (d: Date) => void;
}) {
  // extract initial values or fallbacks
  const initHour =
    valueDate !== null ? ((valueDate.getHours() % 12) as number) || 12 : 12;
  const initMinute = valueDate !== null ? valueDate.getMinutes() : 0;
  const initMeridiem =
    valueDate !== null && valueDate.getHours() >= 12 ? "PM" : "AM";

  const [hour, setHour] = useState<number>(initHour);
  const [minute, setMinute] = useState<number>(initMinute);
  const [meridiem, setMeridiem] = useState<string>(initMeridiem);

  // whenever wheels change → update Date
  useEffect(() => {
    const date = valueDate ? new Date(valueDate) : new Date();

    // convert to 24-hour
    const hours24 = meridiem === "PM" ? (hour % 12) + 12 : hour % 12;

    date.setHours(hours24);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    onChange(date);
  }, [hour, minute, meridiem, onChange, valueDate]);

  return (
    <div className="mx-auto w-full max-w-xs">
      <WheelPickerWrapper className="flex gap-2">
        <WheelPicker
          options={hourOptions}
          value={hour}
          onValueChange={(v) => setHour(v as number)}
          infinite
        />
        <WheelPicker
          options={minuteOptions}
          value={minute}
          onValueChange={(v) => setMinute(v as number)}
          infinite
        />
        <WheelPicker
          options={meridiemOptions}
          value={meridiem}
          onValueChange={(v) => setMeridiem(v as string)}
        />
      </WheelPickerWrapper>
    </div>
  );
}
