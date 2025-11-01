"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "lucide-react";

interface QuantitySelectorProps {
   quantity: number;
   onDecrease: () => void;
   onIncrease: () => void;
   className?: string;
}

export function QuantitySelector({
   quantity,
   onDecrease,
   onIncrease,
   className,
}: QuantitySelectorProps) {
   return (
      <div
         className={cn(
            "flex h-11 min-w-33 items-center justify-between gap-1 rounded-md bg-black px-2.5 py-2 shadow-lg backdrop-blur-md",
            className
         )}
      >
         <Button
            variant="link"
            onClick={onDecrease}
            className="flex h-7 w-7 items-center justify-center opacity-80 hover:opacity-100"
            aria-label="Decrease quantity"
         >
            <MinusIcon className="size-4 text-white" />
         </Button>
         <span className="min-w-[1.5rem] text-center text-lg font-semibold text-white">
            {quantity}
         </span>
         <Button
            variant="link"
            onClick={onIncrease}
            className="flex h-7 w-7 items-center justify-center opacity-80 hover:opacity-100"
            aria-label="Increase quantity"
         >
            <PlusIcon className="size-4 text-white" />
         </Button>
      </div>
   );
}
