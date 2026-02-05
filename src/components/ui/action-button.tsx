"use client";

import { ReactNode } from "react";

import Link from "next/link";

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
    <div className="relative size-5 overflow-hidden">
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

type ActionButtonLinkProps = ButtonProps & {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
};

export function ActionButton1({
  href,
  children,
  icon,
  className,
  size = "lg",
  ...props
}: ActionButtonLinkProps) {
  const isMobile = useIsMobile();

  return (
    <Link href={href}>
      <Button
        size={isMobile ? "md" : size}
        className={cn(
          "group relative flex h-14 w-full items-center justify-between overflow-hidden rounded-xl uppercase",
          className
        )}
        {...props}
      >
        <div className="relative flex w-full items-center justify-between">
          <TextTrack>{children}</TextTrack>
          {icon && <IconTrack icon={icon} />}
        </div>
      </Button>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Action Button 2 (Submit / Normal)                    */
/* -------------------------------------------------------------------------- */

type ActionButtonProps = ButtonProps & {
  children: ReactNode;
};

export function ActionButton2({
  children,
  className,
  size = "lg",
  ...props
}: ActionButtonProps) {
  const isMobile = useIsMobile();

  return (
    <Button
      size={isMobile ? "sm" : size}
      className={cn(
        "group relative flex h-10 w-full items-center justify-center overflow-hidden rounded-lg text-xs uppercase md:h-12 md:rounded-xl md:text-sm lg:h-14 lg:text-base",
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
