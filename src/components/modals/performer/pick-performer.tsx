"use client";

import { useRef, useState } from "react";

import Image from "next/image";

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
import { searchPerformersAction } from "@/domains/performer/performer.actions";
import { PerformerSummary } from "@/domains/performer/performer.schema";

type Props = {
  value: string[]; // source of truth
  onChange: (ids: string[]) => void;
};

export function PerformerPicker({ value, onChange }: Props) {
  const [results, setResults] = useState<PerformerSummary[]>([]);
  const [open, setOpen] = useState(false);

  // cache for showing names/images
  const [cache, setCache] = useState<Record<string, PerformerSummary>>({});

  // ✅ NEW → control input
  const [search, setSearch] = useState("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ======================= Search Performers =======================
  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (searchValue.length < 2) {
        setResults([]);
        return;
      }

      const data = await searchPerformersAction(searchValue);
      setResults(data);

      // save to cache
      setCache((prev) => {
        const map = { ...prev };
        data.forEach((p) => (map[p.id] = p));
        return map;
      });

      setOpen(true);
    }, 300);
  };

  // ======================= Toggle Performer =======================
  const togglePerformer = (performer: PerformerSummary) => {
    if (value.includes(performer.id)) {
      onChange(value.filter((id) => id !== performer.id));
    } else {
      onChange([...value, performer.id]);
    }

    // ✅ NEW → reset input
    setSearch("");
    setResults([]);
  };

  return (
    <div className="space-y-3">
      {/* ======================= Selected Performers ======================= */}
      <div className="flex flex-wrap gap-2">
        {value.map((id) => {
          const performer = cache[id];

          return (
            <Badge
              key={id}
              variant="secondary"
              className="flex items-center gap-3 py-1.5 pl-5 text-sm"
            >
              {performer?.name ?? id}

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

      {/* ======================= Search Performers ======================= */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Command className="rounded-lg border">
              <CommandInput
                value={search}
                placeholder="Search performers ..."
                onValueChange={handleSearch}
                className="placeholder:font-light"
              />
            </Command>
          </div>
        </PopoverTrigger>

        {/* ======================= Search Results ======================= */}
        <PopoverContent
          className="p-0"
          align="start"
          side="bottom"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandEmpty className="p-0 pt-2 text-center text-sm">
              No performers found.
            </CommandEmpty>

            <CommandGroup className="max-h-52 overflow-y-auto">
              {results.map((performer) => (
                <CommandItem
                  key={performer.id}
                  onSelect={() => togglePerformer(performer)}
                  className="flex items-center gap-3"
                >
                  <Image
                    src={performer.image}
                    alt={performer.name}
                    width={32}
                    height={32}
                    className="aspect-square rounded-full object-cover"
                  />
                  {performer.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
