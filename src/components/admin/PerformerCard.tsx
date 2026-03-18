import Link from "next/link";

import { Image } from "@imagekit/next";

import { Performer } from "@/domains/performer/performer.schema";
import { config } from "@/lib/config";
import { DeleteModalType } from "@/types/delete.types";

import { DeleteModal } from "../modals/delete.modal";
import { PerformerModal } from "../modals/performer/performer-modal";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PerformerCardProps {
  id: string;
  href: string;
  name: string;
  image: string;
  role: string;
  bio: string;
}

export function PerformerCard({
  id,
  href = "#",
  name,
  image,
  role,
  bio,
}: PerformerCardProps) {
  const performerForModal: Performer = {
    id,
    name,
    image,
    role,
    bio,
  };

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
              <PerformerModal type="update" performer={performerForModal} />
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
