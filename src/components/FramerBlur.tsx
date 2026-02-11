import { cn } from "@/lib/utils";

type FramerBlurProps = {
  className?: string;
};

export default function FramerBlur({ className = "" }: FramerBlurProps) {
  const blurs = [0.46875, 0.9375, 1.875, 3.75, 7.5, 15, 30];
  // const blurs = [0.9375, 1.5381, 2.5236, 4.1396, 6.7932, 11.151, 18.299, 30.0];

  return (
    <div className={cn("fixed right-0 bottom-0 left-0 w-full", className)}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          overflow: "hidden",
          background: "none",
        }}
      >
        {blurs.map((blur, i) => {
          const start = i * 12.5;
          const mid1 = start + 12.5;
          const mid2 = start + 25;
          const end = start + 37.5;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: i + 1,
                pointerEvents: "none",
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0) ${start}%,
            rgba(0,0,0,1) ${mid1}%,
            rgba(0,0,0,1) ${mid2}%,
            rgba(0,0,0,0) ${end}%
          )`,
                WebkitMaskImage: `linear-gradient(
            to bottom,
            rgba(0,0,0,0) ${start}%,
            rgba(0,0,0,1) ${mid1}%,
            rgba(0,0,0,1) ${mid2}%,
            rgba(0,0,0,0) ${end}%
          )`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
