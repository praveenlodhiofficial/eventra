"use client";

import { ReactNode, useState } from "react";

import { motion, useMotionValueEvent, useScroll } from "motion/react";

export function NavbarMotion({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (current > previous && current > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.div
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sticky inset-0 z-50"
    >
      {children}
    </motion.div>
  );
}
