"use client";

import { useRef, useState } from "react";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchVenuesAction } from "@/domains/venue/venue.actions";
import { VenueSummary } from "@/domains/venue/venue.schema";

type Props = {
  value: string[]; // source of truth
  onChange: (ids: string[]) => void;
};

export function VenuePicker({ value, onChange }: Props) {
  const [results, setResults] = useState<VenueSummary[]>([]);
  const [open, setOpen] = useState(false);

  // cache for showing names/images
  const [cache, setCache] = useState<Record<string, VenueSummary>>({});

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ======================= Search Venues =======================
  const handleSearch = (search: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (search.length < 2) {
        setResults([]);
        return;
      }

      const data = await searchVenuesAction(search);
      setResults(data);

      // save to cache
      setCache((prev) => {
        const map = { ...prev };
        data.forEach((v) => (map[v.id] = v));
        return map;
      });

      setOpen(true);
    }, 300);
  };

  // ======================= Toggle Venue =======================

  const toggleVenue = (venue: VenueSummary) => {
    if (value.includes(venue.id)) {
      onChange(value.filter((id) => id !== venue.id));
    } else {
      onChange([...value, venue.id]);
    }
  };

  return (
    <div className="space-y-3">
      {/* ======================= Selected Venues ======================= */}
      <div className="flex flex-wrap gap-2">
        {value.map((id) => {
          const venue = cache[id];

          return (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-3 py-1.5 pl-5 text-sm"
            >
              {venue?.name}, {venue?.city}
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(value.filter((v) => v !== id));
                }}
                variant="default"
                size="icon-sm"
                className="hover:bg-destructive cursor-pointer rounded-full transition-all duration-200"
              >
                <X className="size-4.5" />
              </Button>
            </Badge>
          );
        })}
      </div>

      {/* ======================= Search Venues ======================= */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Command className="rounded-lg border">
              <CommandInput
                placeholder="Search venues ..."
                onValueChange={handleSearch}
                className="placeholder:font-light"
              />
            </Command>
          </div>
        </PopoverTrigger>

        {/* ======================= Search Results ======================= */}
        <PopoverContent
          className="w-lg p-0"
          align="start"
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandEmpty className="p-0 pt-2 text-center text-sm">
              No venues found.
            </CommandEmpty>

            <CommandGroup className="max-h-52 overflow-y-auto">
              {results.map((venue) => (
                <CommandItem
                  key={venue.id}
                  onSelect={() => toggleVenue(venue)}
                  className="flex flex-col items-start gap-1"
                >
                  <span className="text-sm font-medium">{venue.name}</span>
                  <span className="text-muted-foreground text-sm">
                    {venue.city}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
