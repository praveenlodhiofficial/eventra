"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ExpandableTextProps {
   text: string;
   maxLines?: number;
   className?: string;
}

export default function ExpandableText({
   text,
   maxLines = 5,
   className = "",
}: ExpandableTextProps) {
   const [isExpanded, setIsExpanded] = useState(false);
   const [needsTruncation, setNeedsTruncation] = useState(false);
   const textRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (textRef.current) {
         const element = textRef.current;
         const lineHeight = parseInt(getComputedStyle(element).lineHeight);
         const maxHeight = lineHeight * maxLines;
         setNeedsTruncation(element.scrollHeight > maxHeight);
      }
   }, [text, maxLines]);

   const getLineClampClass = () => {
      const clampClasses = {
         1: "line-clamp-1",
         2: "line-clamp-2",
         3: "line-clamp-3",
         4: "line-clamp-4",
         5: "line-clamp-5",
         6: "line-clamp-6",
         7: "line-clamp-7",
         8: "line-clamp-8",
         9: "line-clamp-9",
         10: "line-clamp-10",
      };
      return clampClasses[maxLines as keyof typeof clampClasses] || "line-clamp-5";
   };

   return (
      <div className={`space-y-3 ${className}`}>
         <div className="text-justify whitespace-pre-wrap">
            <AnimatePresence mode="wait">
               {!isExpanded ? (
                  <motion.div
                     key="collapsed"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.3 }}
                     className={getLineClampClass()}
                     ref={textRef}
                  >
                     {text}
                  </motion.div>
               ) : (
                  <motion.div
                     key="expanded"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                     {text}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {needsTruncation && (
            <motion.button
               onClick={() => setIsExpanded(!isExpanded)}
               className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-800"
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
            >
               {isExpanded ? "Read less" : "Read more"}
            </motion.button>
         )}
      </div>
   );
}
