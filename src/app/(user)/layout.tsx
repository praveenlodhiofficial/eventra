import FramerBlur from "@/components/FramerBlur";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

type UserLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function UserLayout({ children, className }: UserLayoutProps) {
  return (
    <div className={cn("mx-auto w-full max-w-440", className)}>
      <Navbar />
      {children}
      <FramerBlur className="pointer-events-none h-25" />
    </div>
  );
}
