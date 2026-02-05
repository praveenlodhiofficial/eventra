"use client";
import { useRef, useState } from "react";

import { Image } from "@imagekit/next";
import { UploadIcon, XIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { config } from "@/lib/config";
import { deleteFromImageKit, uploadToImageKit } from "@/lib/imagekit";

import { Button } from "../ui/button";

type FileItem = {
  fileId: string;
  url: string;
  progress: number;
};

export function GalleryImageUpload({
  folder,
  onUploaded,
}: {
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleUpload = async (file: File) => {
    const tempId = crypto.randomUUID();

    setFiles((prev) => [
      ...prev,
      { fileId: tempId, url: URL.createObjectURL(file), progress: 0 },
    ]);

    const res = await uploadToImageKit(file, folder, (p) => {
      setFiles((prev) =>
        prev.map((f) => (f.fileId === tempId ? { ...f, progress: p } : f))
      );
    });

    if (!res.url || !res.fileId) {
      setFiles((prev) => prev.filter((f) => f.fileId !== tempId));
      return;
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.fileId === tempId
          ? { fileId: res.fileId!, url: res.url!, progress: 100 }
          : f
      )
    );

    onUploaded(res.url);
  };

  const remove = async (fileId: string) => {
    await deleteFromImageKit(fileId);
    setFiles((prev) => prev.filter((f) => f.fileId !== fileId));
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {files.map((f) => (
          <div
            key={f.fileId}
            className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-200"
          >
            <Progress
              value={f.progress}
              max={100}
              className="pointer-events-none absolute inset-0 h-full rounded-none"
              indicatorClassName="bg-green-500/50"
            />

            <Image
              urlEndpoint={config.imagekit.url_endpoint}
              src={f.url}
              alt="Gallery Images"
              fill
              className="object-cover text-center text-sm"
              quality={30}
              transformation={[{ quality: 80 }]}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button" // 🔑 prevents form submit
                  variant="default"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // 🔑 prevents bubbling
                    remove(f.fileId);
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
          </div>
        ))}

        <Button
          variant="secondary"
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-secondary group text-muted-foreground aspect-video h-full w-full cursor-pointer flex-col items-center justify-center text-sm font-normal hover:text-black"
        >
          <UploadIcon className="text-muted-foreground size-4 group-hover:text-black" />
          Add Images
        </Button>
      </div>

      <Input
        ref={inputRef}
        hidden
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          Array.from(e.target.files || []).forEach(handleUpload);
          e.target.value = "";
        }}
      />
    </div>
  );
}
