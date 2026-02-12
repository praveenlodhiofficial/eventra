"use client";

import { useState } from "react";

import * as motion from "motion/react-client";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

import { ActionButton1 } from "./action-button";

type ReadMoreProps = {
  text: string;
  lines?: number;
  className?: string;
};

export function ReadMore({ text, lines = 4, className }: ReadMoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : `${lines * 1.5}em`,
        }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden"
      >
        <p className="whitespace-pre-line">{text}</p>
      </motion.div>

      <ActionButton1
        variant="link"
        onClick={() => setOpen(!open)}
        className="items-cente mt-3 flex origin-left scale-80 p-0 text-sm font-medium text-blue-500 hover:underline md:scale-100"
        icon={
          open ? (
            <IconChevronUp className="size-5 scale-80" />
          ) : (
            <IconChevronDown className="size-5 scale-80" />
          )
        }
        gap="gap-2 md:gap-3"
      >
        {open ? "Read less" : "Read more"}
      </ActionButton1>
    </div>
  );
}
