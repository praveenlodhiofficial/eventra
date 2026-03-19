"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Search, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { searchPerformersAction } from "@/domains/performer/performer.actions";
import { PerformerSummary } from "@/domains/performer/performer.schema";
import { cn } from "@/lib/utils";

export function PerformerSearchBar() {
  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PerformerSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await searchPerformersAction(query);
        setResults(res);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:border-primary mx-auto flex max-w-2xl cursor-pointer items-center gap-3 rounded-full border px-6 py-4 transition"
      >
        <Search className="size-4" />
        <span className="text-sm">
          Search performers by name, role, or style...
        </span>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className="flex h-full w-full flex-col gap-3 rounded-none px-3 md:h-[calc(100vh-7rem)] md:max-w-3xl md:px-5 lg:rounded-3xl">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="px-5 py-1 text-center text-base font-semibold uppercase md:text-lg lg:text-xl">
              Search Performers
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="flex flex-col gap-3 px-2 md:px-4">
            {/* Input Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />

                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search performers..."
                  className="border-border bg-background/80 focus:ring-primary/30 h-12 rounded-xl border pr-10 pl-9 backdrop-blur-sm focus:ring-2"
                />

                {query && (
                  <button
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <X className="text-muted-foreground size-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions Box */}
            <div className="bg-muted/60 flex-1 overflow-hidden rounded-2xl border">
              {/* Top Bar */}
              <div className="text-muted-foreground flex items-center justify-between border-b px-4 py-2 text-xs uppercase">
                <span>Suggestions</span>
                <span className={cn(isLoading ? "opacity-100" : "opacity-0")}>
                  Searching…
                </span>
              </div>

              {/* Results */}
              <div className="no-scrollbar h-[56vh] overflow-y-auto p-3">
                {/* Empty initial */}
                {!query && (
                  <div className="text-muted-foreground px-3 py-8 text-center text-sm">
                    Start typing to search performers.
                  </div>
                )}

                {/* Loading */}
                {isLoading && (
                  <div className="px-3 py-8 text-center text-sm">
                    Searching performers...
                  </div>
                )}

                {/* No results */}
                {!isLoading && query && results.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm">
                    No performers found for &quot;{query}&quot;
                  </div>
                )}

                {/* Results */}
                <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
                  {results.map((performer) => (
                    <Link
                      key={performer.id}
                      href={`/performers/${performer.slug}`}
                      className="w-fit rounded-xl text-left text-sm transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        {/* Image */}
                        <div className="relative h-22 w-22 overflow-hidden rounded-xl md:h-30 md:w-30">
                          <Image
                            src={performer.image}
                            alt={performer.name}
                            height={200}
                            width={200}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Text */}
                        <div className="text-center">
                          <div className="line-clamp-1 font-medium">
                            {performer.name}
                          </div>
                          <div className="text-muted-foreground line-clamp-1 text-xs">
                            {performer.role}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
