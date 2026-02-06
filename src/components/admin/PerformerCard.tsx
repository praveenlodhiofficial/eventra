import Image from "next/image";
import Link from "next/link";

import { IconEdit, IconTrash } from "@tabler/icons-react";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PerformerCardProps {
  href: string;
  name: string;
  image: string;
}

export function PerformerCard({ href = "#", name, image }: PerformerCardProps) {
  return (
    <Link
      href={href}
      className="group bg-background block w-full overflow-hidden rounded-xl border"
    >
      {/* Image */}
      <div className="relative aspect-9/10 w-full">
        <Image
          src={image}
          alt={name}
          fill
          quality={50}
          className="object-cover transition-transform duration-300"
        />

        <div className="absolute top-2 right-2">
          <div className="flex flex-col gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="default" size="icon-xs">
                  <IconEdit className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Edit Performer Details</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon-xs">
                  <IconTrash className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Delete Performer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="p-2">
        <div className="line-clamp-1 text-center text-sm font-medium">
          {name}
        </div>
      </div>
    </Link>
  );
}
