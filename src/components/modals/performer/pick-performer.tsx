"use client";

import { useMemo, useRef, useState } from "react";

import Image from "next/image";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import {
  PerformerSearchResult,
  SearchPerformersAction,
} from "@/domains/performer/performer.actions";

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;
};

export function PerformerPicker({ value, onChange }: Props) {
  const [results, setResults] = useState<PerformerSearchResult[]>([]);
  const [open, setOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Derive selected performers from results + value
  const selected = useMemo(
    () => results.filter((performer) => value.includes(performer.id)),
    [results, value]
  );

  const handleSearch = (search: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (search.length < 2) return;

      const data = await SearchPerformersAction(search);
      setResults(data);
      setOpen(true);
    }, 300);
  };

  const togglePerformer = (performer: PerformerSearchResult) => {
    if (value.includes(performer.id)) {
      onChange(value.filter((id) => id !== performer.id));
    } else {
      onChange([...value, performer.id]);
    }
  };

  return (
    <div className="space-y-3">
      {/* ======================= Selected Performers ======================= */}
      <div className="flex flex-wrap gap-2">
        {selected.map((performer) => (
          <Badge
            key={performer.id}
            variant="secondary"
            className="flex items-center gap-2"
          >
            {performer.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => togglePerformer(performer)}
            />
          </Badge>
        ))}
      </div>

      {/* ======================= Performer Search Popover ======================= */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div>
            <Command className="rounded-lg border">
              <CommandInput
                placeholder="Search performers..."
                onValueChange={handleSearch}
              />
            </Command>
          </div>
        </PopoverTrigger>

        {/* ======================= Performer Search Results ======================= */}
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandEmpty>
              <span className="bg-amber-500">Minimum 2 characters</span>
            </CommandEmpty>

            <CommandGroup className="max-h-52 overflow-y-auto">
              {results.map((performer) => (
                <CommandItem
                  key={performer.id}
                  onSelect={() => {
                    togglePerformer(performer);
                    setOpen(false);
                  }}
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
