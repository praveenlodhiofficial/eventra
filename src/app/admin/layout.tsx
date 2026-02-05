import { cn } from "@/lib/utils";

type AdminLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AdminLayout({ children, className }: AdminLayoutProps) {
  return <div className={cn(className)}>{children}</div>;
}
