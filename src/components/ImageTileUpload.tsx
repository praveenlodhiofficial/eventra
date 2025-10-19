"use client";

import FileUpload from "@/components/FileUpload";
import useMultiFileUpload from "@/hooks/useMultiFileUpload";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
   value?: string;
   onChange: (value: string | null) => void;
   folder: string;
   className?: string;
   add?: boolean; // if true, shows the + tile; otherwise shows the image tile
   multiple?: boolean; // allow multiple selection at once when add is true
   placeholder?: string; // optional placeholder to mirror cover wording
   mediaType?: "image" | "video" | "both"; // what type of media to accept
};

export default function ImageTileUpload({
   value,
   onChange,
   folder,
   className,
   add,
   multiple,
   placeholder,
   mediaType = "image",
}: Props) {
   // Move all hooks to the top level to avoid conditional hook calls
   const { pending, startUploads } = useMultiFileUpload(
      folder,
      (filePath) => onChange(filePath),
      mediaType
   );
   const inputRef = useRef<HTMLInputElement>(null);
   const [nonce, setNonce] = useState(0);

   // Add tile
   if (add) {
      if (multiple) {
         return (
            <div className={cn("flex flex-wrap items-start gap-3", className)}>
               {pending.map((item) => (
                  <div
                     key={item.id}
                     className="relative aspect-video w-[310px] overflow-hidden rounded-md bg-white shadow-xs md:w-[217px]"
                  >
                     <div className="absolute inset-0 bg-green-100" />
                     <div
                        className="absolute inset-0 bg-green-300"
                        style={{ width: `${item.progress}%` }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-700">
                        {item.progress}% Uploading...
                     </div>
                  </div>
               ))}
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     inputRef.current?.click();
                  }}
                  className="flex aspect-video w-[310px] items-center justify-center rounded-md bg-gray-50 transition-all duration-200 hover:bg-gray-50/20 md:w-[217px]"
                  title="Add images"
               >
                  <div className="flex items-center gap-1.5">
                     <Image
                        src="/icons/upload.svg"
                        alt="upload-icon"
                        width={15}
                        height={15}
                        className="relative z-10 object-cover"
                     />
                     <span className="text-muted-foreground text-[13px]">
                        {placeholder ?? "Upload media"}
                     </span>
                  </div>
               </button>
               <input
                  ref={inputRef}
                  type="file"
                  accept={
                     mediaType === "both"
                        ? "image/*,video/*"
                        : mediaType === "video"
                          ? "video/*"
                          : "image/*"
                  }
                  multiple
                  className="hidden"
                  onChange={(e) => {
                     const files = e.target.files;
                     if (files && files.length > 0) {
                        startUploads(files);
                        e.currentTarget.value = ""; // reset to allow reselecting same files
                     }
                  }}
               />
            </div>
         );
      }

      // Single add: delegate to FileUpload so its built-in progress is used
      return (
         <div className="w-[310px] md:w-[217px]">
            <FileUpload
               key={nonce}
               type={mediaType === "video" ? "video" : "image"}
               accept={
                  mediaType === "both"
                     ? "image/*,video/*"
                     : mediaType === "video"
                       ? "video/*"
                       : "image/*"
               }
               placeholder={
                  placeholder ??
                  (mediaType === "both"
                     ? "Add media"
                     : mediaType === "video"
                       ? "Add video"
                       : "Add image")
               }
               folder={folder}
               onFileChange={(p) => {
                  onChange(p);
                  setNonce((n) => n + 1);
               }}
               className={cn("aspect-video w-[310px] md:w-[217px]")}
            />
         </div>
      );
   }

   // Media tile with change on click - auto-detect type for "both"
   const detectMediaType = (filePath: string) => {
      if (mediaType === "both") {
         const extension = filePath.split(".").pop()?.toLowerCase();
         return ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(extension || "")
            ? "video"
            : "image";
      }
      return mediaType === "video" ? "video" : "image";
   };

   return (
      <div className={cn("w-[310px] md:w-[217px]", className)}>
         <FileUpload
            type={detectMediaType(value || "")}
            accept={
               mediaType === "both"
                  ? "image/*,video/*"
                  : mediaType === "video"
                    ? "video/*"
                    : "image/*"
            }
            placeholder={placeholder ?? (mediaType === "video" ? "Change video" : "Change image")}
            folder={folder}
            value={value ?? undefined}
            onFileChange={(p) => onChange(p)}
            overlayMode="remove"
            onRemove={() => onChange(null)}
            className="w-[310px] md:w-[217px]"
         />
      </div>
   );
}
