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
  value: string | null; // single source of truth
  onChange: (id: string | null) => void;
};

export function VenuePicker({ value, onChange }: Props) {
  const [results, setResults] = useState<VenueSummary[]>([]);
  const [open, setOpen] = useState(false);

  // cache for showing name/city
  const [cache, setCache] = useState<Record<string, VenueSummary>>({});

  // ✅ NEW → control input
  const [search, setSearch] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ======================= Search Venues =======================
  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (searchValue.length < 2) {
        setResults([]);
        return;
      }

      const data = await searchVenuesAction(searchValue);
      setResults(data);

      setCache((prev) => {
        const map = { ...prev };
        data.forEach((v) => (map[v.id] = v));
        return map;
      });

      setOpen(true);
    }, 300);
  };

  // ======================= Select =======================
  const selectVenue = (venue: VenueSummary) => {
    onChange(venue.id); // replace, not append
    setCache((prev) => ({ ...prev, [venue.id]: venue }));

    // ✅ NEW → reset input
    setSearch("");
    setResults([]);

    setOpen(false);
  };

  const selectedVenue = value ? cache[value] : undefined;

  return (
    <div className="space-y-3">
      {/* ======================= Selected ======================= */}
      {selectedVenue && (
        <Badge
          variant="secondary"
          className="flex w-fit items-center gap-3 py-1.5 pl-5 text-sm"
        >
          {selectedVenue.name}, {selectedVenue.city}
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(null);
            }}
            variant="default"
            size="icon-sm"
            className="hover:bg-destructive cursor-pointer rounded-full transition-all duration-200"
          >
            <X className="size-4.5" />
          </Button>
        </Badge>
      )}

      {/* ======================= Search ======================= */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Command className="rounded-lg border">
              <CommandInput
                value={search}
                placeholder="Search venue ..."
                onValueChange={handleSearch}
                className="placeholder:font-light"
              />
            </Command>
          </div>
        </PopoverTrigger>

        {/* ======================= Results ======================= */}
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
                  onSelect={() => selectVenue(venue)}
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
