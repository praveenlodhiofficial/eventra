import { cn } from "@/lib/utils";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full space-y-15 p-5 md:space-y-20", className)}
    >
      {children}
    </div>
  );
}
