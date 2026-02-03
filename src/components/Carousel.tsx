"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { animate, motion, useMotionValue } from "motion/react";

export function Carousel({ productImageUrls }: { productImageUrls: string[] }) {
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
    <div className="mx-auto h-full w-full">
      <div className="flex flex-col gap-3">
        <div className="relative h-screen overflow-hidden" ref={containerRef}>
          <motion.div className="flex" style={{ x }}>
            {productImageUrls.map((item) => (
              <div
                key={item}
                className="h-[30vh] w-full shrink-0 md:h-[70vh] lg:h-full"
              >
                <Image
                  width={2000}
                  height={2000}
                  src={item}
                  alt={item}
                  className="pointer-events-none h-full w-full object-cover select-none"
                  draggable={false}
                />
              </div>
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
            disabled={index === productImageUrls.length - 1}
            onClick={() =>
              setIndex((i) => Math.min(productImageUrls.length - 1, i + 1))
            }
            className={`absolute top-1/2 right-4 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition-transform ${
              index === productImageUrls.length - 1
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
          {/* Progress Indicator */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-xl border border-white/30 bg-white/20 p-2">
            {productImageUrls.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
