"use client";

import { useRef } from "react";

import Link from "next/link";

import { Image } from "@imagekit/next";
import { motion, useScroll, useTransform } from "motion/react";

import { config } from "@/lib/config";

type Props = {
  performer: {
    id: string;
    name: string;
    slug: string;
    image: string;
    role: string;
  };
};

export function PerformerCard({ performer }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  // same motion mapping as BlogCard
  const rotateZ = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1.4, 1]);

  return (
    <motion.div
      style={{ rotateZ, y, scale, transformOrigin: "bottom center" }}
      className="will-change-transform"
    >
      <Link
        href={`/performers/${performer.slug}`}
        ref={ref}
        className="group block"
      >
        <div className="group-hover:bg-muted overflow-hidden rounded-2xl border transition-all duration-500">
          {/* Image */}
          <div className="relative aspect-9/11 w-full overflow-hidden">
            <motion.div
              style={{ scale: scaleImage, transformOrigin: "bottom top" }}
              className="h-full w-full will-change-transform"
            >
              <Image
                urlEndpoint={config.imagekit.url_endpoint}
                src={performer.image}
                alt={performer.name}
                fill
                transformation={[{ width: 400, height: 500, quality: 70 }]}
                className="scale-105 object-cover transition-transform duration-400 ease-in-out group-hover:scale-100"
              />
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-0.5 p-3">
            <p className="line-clamp-1 text-xs font-medium text-orange-500 capitalize">
              {performer.role}
            </p>

            <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
              {performer.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
