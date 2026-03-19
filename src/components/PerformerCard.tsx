import Link from "next/link";

import { Image } from "@imagekit/next";

import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

type Props = {
  performer: {
    id: string;
    name: string;
    slug: string;
    image: string;
    role: string;
  };
};

export function PerformerCard({ performer }: Props) {
  return (
    <div className="group hover:shadow-primary/20 hover:border-primary/50 overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg">
      {/* Image */}
      <div className="bg-muted relative aspect-square w-full overflow-hidden">
        <Image
          urlEndpoint={config.imagekit.url_endpoint}
          src={performer.image}
          alt={performer.name}
          fill
          transformation={[{ width: 400, height: 400, quality: 80 }]}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-sm font-semibold md:text-base">
            {performer.name}
          </h3>
          <p className="text-muted-foreground line-clamp-1 text-xs capitalize md:text-sm">
            {performer.role}
          </p>
        </div>

        {/* Button */}
        <Link href={`/performers/${performer.slug}`} className="block">
          <Button className="w-full" variant="default" size="sm">
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}
