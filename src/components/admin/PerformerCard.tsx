import Link from "next/link";

import { Image } from "@imagekit/next";
import { IconEdit } from "@tabler/icons-react";

import { config } from "@/lib/config";
import { DeleteModalType } from "@/types/delete.types";

import { DeleteModal } from "../modals/delete.modal";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PerformerCardProps {
  id: string;
  href: string;
  name: string;
  image: string;
  role: string;
}

export function PerformerCard({
  id,
  href = "#",
  name,
  image,
  role,
}: PerformerCardProps) {
  return (
    <div className="group bg-background relative block w-full overflow-hidden rounded-xl border">
      {/* Image */}
      <Link href={href} className="aspect-9/10 w-full">
        <div className="aspect-9/10 w-full">
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={image}
            alt={name}
            fill
            transformation={[{ width: 500, height: 500 }]}
            className="object-cover transition-transform duration-300"
          />
        </div>

        {/* Name */}
        <div className="flex flex-col items-center justify-center p-2">
          <h3 className="line-clamp-1 text-center text-sm font-medium">
            {name}
          </h3>
          <p className="text-muted-foreground text-[13px] font-light text-balance">
            {role}
          </p>
        </div>
      </Link>

      <div className="absolute top-2 right-2">
        <div className="flex flex-col gap-1.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="default" size="icon-sm" className="rounded-lg">
                <IconEdit className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Edit Performer Details</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <DeleteModal
                  type={DeleteModalType.PERFORMER}
                  id={id}
                  trigger="icon"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete Performer</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
