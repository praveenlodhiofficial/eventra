"use client";

import { useRef, useState } from "react";

import { Image } from "@imagekit/next";
import { UploadIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { config } from "@/lib/config";
import { deleteFromImageKit, uploadToImageKit } from "@/lib/imagekit";

import { Button } from "../ui/button";
import { TooltipContent } from "../ui/tooltip";
import { Tooltip, TooltipTrigger } from "../ui/tooltip";

export function CoverImageUpload({
  folder,
  onUploaded,
  onRemoved,
  defaultImage,
  quality = 50,
}: {
  folder: string;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
  defaultImage?: string;
  quality?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(defaultImage ?? null);
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file));
    setProgress(0);

    if (fileId) {
      await deleteFromImageKit(fileId);
    }

    const res = await uploadToImageKit(file, folder, setProgress);

    if (!res.url || !res.fileId) {
      throw new Error("Upload response is missing URL or fileId");
    }

    setPreview(res.url);
    setFileId(res.fileId);
    onUploaded(res.url);
  };

  const remove = async (fileId: string) => {
    await deleteFromImageKit(fileId);
    setPreview(null);
    setFileId(null);
    setProgress(0);
    onRemoved();
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl"
      >
        <Progress
          value={progress}
          max={100}
          className="bg-secondary pointer-events-none absolute inset-0 z-[-1] h-full rounded-none"
          indicatorClassName="bg-green-500/50"
        />

        {preview ? (
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={preview}
            alt="Cover Image"
            fill
            className="object-cover text-center text-sm"
            quality={quality}
            transformation={[{ quality: 80 }]}
          />
        ) : (
          <div className="group flex h-full w-full flex-col items-center justify-center gap-1">
            <UploadIcon className="text-muted-foreground size-4.5 group-hover:text-black" />
            <p className="text-muted-foreground text-center text-sm group-hover:text-black">
              Upload Cover Image
            </p>
          </div>
        )}

        {preview && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(fileId!);
                }}
                className="absolute top-0 right-0 scale-80 rounded-full"
              >
                <XIcon className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove Image</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <Input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
