"use client";

import { useEffect, useMemo, useState } from "react";

import { CrosshairIcon, SearchIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { reverseGeocode, searchLocations } from "@/lib/location/mapbox";
import type { LocationResult } from "@/lib/location/types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  value?: LocationResult | null;
  onSelect: (value: LocationResult) => void;
};

export function LocationPickerDialog({
  open,
  onOpenChange,
  title = "Select location",
  value,
  onSelect,
}: Props) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [selected, setSelected] = useState<LocationResult | null>(
    value ?? null
  );
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSelectionValid = useMemo(() => {
    if (!selected) return false;
    return query.trim() === selected.name.trim();
  }, [query, selected]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuggestions([]);

    // When opening, sync from current value
    const nextName = value?.name ?? "";
    setQuery(nextName);
    setSelected(value ?? null);
  }, [open, value]);

  useEffect(() => {
    if (!open) return;

    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    // If user edits text after selecting, invalidate selection
    if (selected && q !== selected.name.trim()) {
      setSelected(null);
    }

    const handle = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      try {
        const results = await searchLocations(q);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
        setError("Failed to search locations");
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(handle);
  }, [open, query, selected]);

  const useMyLocation = async () => {
    setError(null);
    setIsLocating(true);

    try {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported in this browser");
        return;
      }

      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
        });
      });

      const lng = pos.coords.longitude;
      const lat = pos.coords.latitude;

      const resolved = await reverseGeocode(lng, lat);
      const next = resolved ?? { name: "Current location", lat, lng };

      setSelected(next);
      setQuery(next.name);
      setSuggestions([]);
      onSelect(next);
      onOpenChange(false);
    } catch {
      setError("Unable to get your current location");
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="flex h-full w-full flex-col gap-3 rounded-none px-3 md:h-[calc(100vh-7rem)] md:max-w-3xl md:px-5 lg:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="px-5 py-1 text-center text-base font-semibold uppercase md:text-lg lg:text-xl">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 px-2 md:px-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a location..."
                className="h-12 rounded-xl pl-9"
                aria-invalid={!!error && !isSelectionValid}
              />
            </div>

            <button
              type="button"
              onClick={useMyLocation}
              disabled={isLocating}
              className={cn(
                "bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 font-medium uppercase transition-opacity disabled:cursor-not-allowed disabled:opacity-70 md:text-sm"
              )}
            >
              <CrosshairIcon className="size-4" />
              <span> {isLocating ? "Locating..." : "Detect"}</span>
            </button>
          </div>

          {!!error && (
            <div className="text-destructive px-1 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="bg-muted/60 flex-1 overflow-hidden rounded-2xl border">
            <div className="text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs uppercase">
              <span>Suggestions</span>
              <span className={cn(isSearching ? "opacity-100" : "opacity-0")}>
                Searching…
              </span>
            </div>

            <div className="no-scrollbar h-[51vh] overflow-y-auto p-2">
              {suggestions.length === 0 ? (
                <div className="text-muted-foreground px-3 py-8 text-center text-sm">
                  Start typing to see suggestions.
                </div>
              ) : (
                <div className="space-y-1">
                  {suggestions.map((sug) => {
                    const active = selected?.name === sug.name;
                    return (
                      <button
                        key={`${sug.lng}-${sug.lat}-${sug.name}`}
                        type="button"
                        onClick={() => {
                          setSelected(sug);
                          setQuery(sug.name);
                          setError(null);
                          onSelect(sug);
                          onOpenChange(false);
                        }}
                        className={cn(
                          "hover:bg-background w-full rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                          active
                            ? "bg-background border-primary"
                            : "border-transparent bg-transparent"
                        )}
                      >
                        <div className="font-medium">{sug.name}</div>
                        <div className="text-muted-foreground mt-0.5 text-xs">
                          {sug.lat.toFixed(5)}, {sug.lng.toFixed(5)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
