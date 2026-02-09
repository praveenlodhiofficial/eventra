"use client";

import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

import { motion } from "motion/react";

import { PerformerSummary } from "@/domains/performer/performer.schema";

export function ArtistSpotlight({
  performers,
}: {
  performers: PerformerSummary[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex gap-3 overflow-x-auto overflow-y-hidden md:gap-5 md:p-2.5 lg:gap-10"
    >
      {performers.map((performer, index) => (
        <Link
          href={`/artists/${performer.slug}`}
          key={performer.id}
          className="overflow-hidden rounded-full"
        >
          <motion.div
            key={performer.id}
            className="flex w-28 shrink-0 flex-col items-center gap-3 rounded-full md:w-44"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            viewport={{ root: scrollRef, once: true }}
          >
            <motion.div
              transition={{ type: "spring", stiffness: 200 }}
              className="size-28 overflow-hidden rounded-full md:size-44"
            >
              <Image
                src={performer.image}
                alt={performer.name}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-all duration-300"
              />
            </motion.div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-sm font-medium md:text-lg md:font-semibold">
                {performer.name}
              </p>
              <p className="text-muted-foreground text-center text-[13px] font-light text-balance md:text-base">
                {performer.role}
              </p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
