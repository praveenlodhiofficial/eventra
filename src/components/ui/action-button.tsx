"use client";

import { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

/* -------------------------------------------------------------------------- */
/*                               Text Track                                   */
/* -------------------------------------------------------------------------- */

function TextTrack({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-4 overflow-hidden md:h-6">
      <div className="flex flex-col transition-transform duration-200 ease-in-out group-hover:-translate-y-6">
        <span className="flex h-4 items-center justify-center md:h-6">
          {children}
        </span>
        <span className="flex h-4 items-center justify-center md:h-6">
          {children}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Icon Track                                   */
/* -------------------------------------------------------------------------- */

function IconTrack({ icon }: { icon: ReactNode }) {
  return (
    <div className="relative flex size-5 overflow-hidden">
      <div className="flex -translate-y-5 flex-col transition-transform duration-200 ease-in-out group-hover:translate-y-0">
        {icon}
        {icon}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Action Button 1 (Link)                            */
/* -------------------------------------------------------------------------- */

type ActionButton1Props = ButtonProps & {
  children: ReactNode;
  icon?: ReactNode;
  gap?: string;
};

export function ActionButton1({
  children,
  icon,
  className,
  size = "lg",
  gap = "gap-5 md:gap-10",
  ...props
}: ActionButton1Props & { gap?: string }) {
  const isMobile = useIsMobile();

  return (
    <Button
      size={isMobile ? "md" : size}
      className={cn(
        "group relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg text-xs uppercase md:h-12 md:text-sm",
        className
      )}
      {...props}
    >
      <div className={cn("relative flex items-center justify-between", gap)}>
        <TextTrack>{children}</TextTrack>
        {icon && <IconTrack icon={icon} />}
      </div>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Action Button 2 (Submit / Normal)                    */
/* -------------------------------------------------------------------------- */

type ActionButton2Props = ButtonProps & {
  children: ReactNode;
};

export function ActionButton2({
  children,
  className,
  size = "lg",
  ...props
}: ActionButton2Props) {
  const isMobile = useIsMobile();

  return (
    <Button
      size={isMobile ? "sm" : size}
      className={cn(
        "group relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg text-xs uppercase md:h-12 md:text-sm",
        className
      )}
      {...props}
    >
      <TextTrack>{children}</TextTrack>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Usage of Action Button                             */
/* -------------------------------------------------------------------------- */

{
  /* <ActionButton1
  href="/projects"
  icon={<ArrowUpRight className="h-5 w-5" />}
>
  View Projects
</ActionButton1> */
}

{
  /* <ActionButton2 type="submit">
  Create Account
</ActionButton2> */
}
