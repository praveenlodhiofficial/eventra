"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { animate, motion, useMotionValue } from "motion/react";

export function Carousel({
  coverImage,
  slug,
}: {
  coverImage: string[];
  slug: string[];
}) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x]);

  return (
    <div className="mx-auto h-fit w-full lg:h-full">
      <div className="flex flex-col gap-3">
        <div
          className="relative h-fit overflow-hidden lg:h-screen"
          ref={containerRef}
        >
          <motion.div className="flex" style={{ x }}>
            {coverImage.map((item, index) => (
              <Link
                href={`/events/${slug[index]}`}
                key={index}
                className="h-[30vh] w-full shrink-0 md:h-[40vh] lg:h-full"
              >
                <Image
                  width={2000}
                  height={2000}
                  src={coverImage[index]}
                  alt={item}
                  className="h-fit w-full object-cover select-none lg:h-full"
                  draggable={false}
                />
              </Link>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute top-1/2 left-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform ${
              index === 0
                ? "cursor-not-allowed opacity-40"
                : "bg-white opacity-70 hover:scale-110 hover:opacity-100"
            }`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>

          {/* Next Button */}
          <motion.button
            disabled={index === coverImage.length - 1}
            onClick={() =>
              setIndex((i) => Math.min(coverImage.length - 1, i + 1))
            }
            className={`absolute top-1/2 right-4 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform md:size-10 ${
              index === coverImage.length - 1
                ? "cursor-not-allowed opacity-40"
                : "bg-white opacity-70 hover:scale-110 hover:opacity-100"
            }`}
          >
            <svg
              className="size-5 md:size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-white/30 bg-white/20 p-1.5 md:p-2">
            {coverImage.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all md:h-2 ${
                  i === index
                    ? "w-5 bg-white md:w-8"
                    : "w-1.5 bg-white/50 md:w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
