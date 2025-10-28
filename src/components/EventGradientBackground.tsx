"use client";

import { Vibrant } from "node-vibrant/browser";
import { useEffect, useState } from "react";

interface EventGradientBackgroundProps {
   coverImageUrl?: string;
   children: React.ReactNode;
}

export default function EventGradientBackground({
   coverImageUrl,
   children,
}: EventGradientBackgroundProps) {
   const [gradientStyle, setGradientStyle] = useState(
      "linear-gradient(to top, transparent, #c6c6c6)"
   );

   useEffect(() => {
      if (coverImageUrl) {
         const extractColors = async () => {
            try {
               const palette = await Vibrant.from(coverImageUrl).getPalette();
               const vibrant = palette.Vibrant?.hex || "#ffffff";
               const newGradientStyle = `linear-gradient(180deg, ${vibrant}45 0%, transparent 100%)`;
               setGradientStyle(newGradientStyle);
            } catch (error) {
               console.error("Error extracting colors:", error);
            }
         };

         extractColors();
      }
   }, [coverImageUrl]);

   return (
      <div className="relative">
         {/* Dynamic Gradient Background */}
         <div
            className="absolute top-0 left-0 z-0 h-[80vh] w-full"
            style={{ background: gradientStyle }}
         />
         {children}
      </div>
   );
}
