"use client";
import { useRef, useState } from "react";

import { Image } from "@imagekit/next";
import { UploadIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
              className="pointer-events-none absolute inset-0 z-10 h-full rounded-none"
              indicatorClassName="bg-green-500/50"
            />
            {f.url ? (
              <Image
                urlEndpoint={config.imagekit.url_endpoint}
                src={f.url}
                alt=""
                fill
                className="z-10 object-cover text-center text-sm"
                quality={30}
                transformation={[{ quality: 80 }]}
              />
            ) : (
              <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-1">
                <UploadIcon className="text-muted-foreground size-4.5 border" />
                <p className="text-muted-foreground text-center text-sm">
                  Upload Gallery Image
                </p>
              </div>
            )}

            <button
              onClick={() => remove(f.fileId)}
              className="absolute top-1 right-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}
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

      <Button type="button" onClick={() => inputRef.current?.click()}>
        Add Images
      </Button>
    </div>
  );
}
