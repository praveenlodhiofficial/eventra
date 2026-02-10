import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

type UserLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function UserLayout({ children, className }: UserLayoutProps) {
  return (
    <div className={cn(className)}>
      {/* <div className="sticky top-0 z-50"> */}
      <Navbar />
      {/* </div> */}
      {children}
    </div>
  );
}
