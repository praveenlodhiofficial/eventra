"use client";

import * as React from "react";

import { type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TicketCounterProps = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
} & Pick<VariantProps<typeof buttonVariants>, "variant" | "size">;

export function TicketCounter({
  value = 0,
  min = 0,
  max = Infinity,
  onChange,
  className,
  variant = "outline",
  size = "default",
}: TicketCounterProps) {
  const [count, setCount] = React.useState(value);
  const isControlled = onChange !== undefined;
  const displayValue = isControlled ? value : count;
  const onQuantityChange: ((value: number) => void) | undefined = onChange;

  function update(v: number) {
    if (v < min || v > max) return;
    if (isControlled) {
      onQuantityChange?.(v);
    } else {
      setCount(v);
      onQuantityChange?.(v);
    }
  }

  return (
    <div className={cn("relative w-28", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {displayValue === 0 ? (
          <motion.div
            key="add"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            <Button
              variant={variant}
              size={size}
              className="w-full cursor-pointer"
              onClick={() => update(1)}
            >
              ADD
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="stepper"
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-primary flex items-center justify-between rounded-md border"
          >
            <Button
              type="button"
              size={
                size === "lg"
                  ? "icon-lg"
                  : size === "md"
                    ? "icon-sm"
                    : size === "sm"
                      ? "icon-sm"
                      : size === "xs"
                        ? "icon-xs"
                        : "icon"
              }
              variant="default"
              onClick={() => update(displayValue - 1)}
              className="cursor-pointer"
            >
              <Minus />
            </Button>

            <motion.span
              key={displayValue}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-primary-foreground w-8 text-center text-sm font-medium"
            >
              {displayValue}
            </motion.span>

            <Button
              type="button"
              size={
                size === "lg"
                  ? "icon-lg"
                  : size === "md"
                    ? "icon-sm"
                    : size === "sm"
                      ? "icon-sm"
                      : size === "xs"
                        ? "icon-xs"
                        : "icon"
              }
              variant="default"
              onClick={() => update(displayValue + 1)}
              className="cursor-pointer"
            >
              <Plus />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
