"use client";

import { useRef } from "react";

import Image from "next/image";

import { motion } from "motion/react";

const artistSpotlight = [
  {
    label: "Arijit Singh",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Coldplay",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Shreya Ghoshal",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Ed Sheeran",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Sonu Nigam",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Taylor Swift",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Rihanna",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Kumar Sanu",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Ariana Grande",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Justin Bieber",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Lata Mangeshkar",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
  {
    label: "Amitabh Bachchan",
    image:
      "https://media.insider.in/image/upload/c_crop,g_custom/v1728456259/j2ikwefju7m5cn8urevg.jpg",
  },
];

export function ArtistSpotlight() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="no-scrollbar flex gap-10 overflow-x-auto p-2.5"
    >
      {artistSpotlight.map((artist, index) => (
        <motion.div
          key={artist.label}
          className="flex w-44 shrink-0 flex-col items-center gap-3"
          initial={{ opacity: 0, y: 30 }}
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
            className="h-44 w-44 overflow-hidden rounded-full"
          >
            <Image
              src={artist.image}
              alt={artist.label}
              width={150}
              height={150}
              className="h-full w-full object-cover transition-all duration-300"
            />
          </motion.div>

          <p className="text-center text-lg font-semibold">{artist.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
