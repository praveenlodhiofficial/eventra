"use client";

import config from "@/lib/config";
import { upload } from "@imagekit/next";
import { useState } from "react";
import { toast } from "sonner";

export type PendingUpload = { id: string; progress: number };

export function useMultiFileUpload(
   folder: string,
   onFileDone: (filePath: string) => void,
   mediaType: "image" | "video" | "both" = "image"
) {
   const [pending, setPending] = useState<PendingUpload[]>([]);

   const startUploads = async (files: FileList) => {
      const toArray = Array.from(files);
      const newItems = toArray.map((file) => ({
         id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
         progress: 0,
      }));
      setPending((p) => [...p, ...newItems]);

      await Promise.all(
         toArray.map(async (file, index) => {
            const id = newItems[index].id;
            try {
               const authRes = await fetch(`${config.env.apiEndpoint}/api/imagekit-auth`);
               if (!authRes.ok) {
                  const errorText = await authRes.text();
                  throw new Error(`Request failed with status ${authRes.status}: ${errorText}`);
               }
               const { token, expire, signature, publicKey } = await authRes.json();

               const res = await upload({
                  file,
                  fileName: file.name,
                  token,
                  expire,
                  signature,
                  publicKey,
                  folder,
                  useUniqueFileName: true,
                  onProgress: (evt: { loaded: number; total: number }) => {
                     const percent = Math.round((evt.loaded / evt.total) * 100);
                     setPending((p) =>
                        p.map((it) => (it.id === id ? { ...it, progress: percent } : it))
                     );
                  },
               });

               onFileDone(res.filePath ?? "");
               setPending((p) => p.filter((it) => it.id !== id));
            } catch (err) {
               setPending((p) => p.filter((it) => it.id !== id));
               const mediaTypeText = mediaType === "both" ? "media" : mediaType;
               const errorMessage = err instanceof Error ? err.message : "Please try again.";
               toast.error(
                  `${mediaTypeText.charAt(0).toUpperCase() + mediaTypeText.slice(1)} upload failed`,
                  { description: errorMessage }
               );
            }
         })
      );
   };

   return { pending, startUploads };
}

export default useMultiFileUpload;
