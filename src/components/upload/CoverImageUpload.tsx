"use client";
import { useRef, useState } from "react";

import { Image } from "@imagekit/next";
import { UploadIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { config } from "@/lib/config";
import { deleteFromImageKit, uploadToImageKit } from "@/lib/imagekit";

import { Button } from "../ui/button";

export function CoverImageUpload({
  folder,
  onUploaded,
}: {
  folder: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
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

  return (
    <div className="flex w-full flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-200"
      >
        <Progress
          value={progress}
          max={100}
          className="pointer-events-none absolute inset-0 z-10 h-full rounded-none"
          indicatorClassName="bg-green-500/50"
        />

        {preview ? (
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={preview}
            alt="Cover Image"
            fill
            className="z-10 object-cover text-center text-sm"
            quality={30}
            transformation={[{ quality: 80 }]}
          />
        ) : (
          <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-1">
            <UploadIcon className="text-muted-foreground size-4.5 border" />
            <p className="text-muted-foreground text-center text-sm">
              Upload Cover Image
            </p>
          </div>
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
