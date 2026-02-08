"use client";

import { format } from "date-fns";
import { Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: Date;
  onChange: (date: Date) => void;
};

export function TimePickerInput({ value, onChange }: Props) {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  function updateTime(h: number, m: number, period: string) {
    const newDate = value ? new Date(value) : new Date();

    let hour24 = h % 12;
    if (period === "PM") hour24 += 12;

    newDate.setHours(hour24);
    newDate.setMinutes(m);
    newDate.setSeconds(0);

    onChange(newDate);
  }

  const currentHour = value ? Number(format(value, "hh")) : 12;
  const currentMinute = value ? Number(format(value, "mm")) : 0;
  const currentPeriod = value ? format(value, "aa") : "AM";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start rounded-lg border border-zinc-200 bg-white/10 px-3 py-6 text-left text-sm font-light shadow-none"
        >
          {value ? format(value, "hh:mm aa") : "Pick time"}
          <Clock className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[260px] p-3">
        <div className="flex gap-2">
          {/* Hours */}
          <div className="flex h-40 flex-1 flex-col overflow-auto">
            {hours.map((h) => (
              <Button
                key={h}
                size="sm"
                variant={h === currentHour ? "default" : "ghost"}
                onClick={() => updateTime(h, currentMinute, currentPeriod)}
              >
                {h}
              </Button>
            ))}
          </div>

          {/* Minutes */}
          <div className="flex h-40 flex-1 flex-col overflow-auto">
            {minutes.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={m === currentMinute ? "default" : "ghost"}
                onClick={() => updateTime(currentHour, m, currentPeriod)}
              >
                {String(m).padStart(2, "0")}
              </Button>
            ))}
          </div>

          {/* AM PM */}
          <div className="flex flex-col gap-2">
            {periods.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === currentPeriod ? "default" : "ghost"}
                onClick={() => updateTime(currentHour, currentMinute, p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
