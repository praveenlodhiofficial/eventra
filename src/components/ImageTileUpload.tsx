"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import useMultiFileUpload from "@/hooks/useMultiFileUpload";
import { cn } from "@/lib/utils";
import { UploadCloud, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = {
   value?: string | string[];
   onChange: (value: string | string[] | null) => void;
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
      (filePath) => {
         const currentValue = valueRef.current;
         console.log("useMultiFileUpload callback called with:", { filePath, multiple, currentValue });
         if (multiple) {
            // Always treat as array for multiple uploads
            const currentArray = Array.isArray(currentValue) ? currentValue : [];
            const newArray = [...currentArray, filePath];
            console.log("Adding file to array:", { currentArray, filePath, newArray, currentValue });
            onChange(newArray);
         } else {
            onChange(filePath);
         }
      },
      mediaType
   );
   const inputRef = useRef<HTMLInputElement>(null);
   const [nonce, setNonce] = useState(0);
   const valueRef = useRef(value);

   // Update ref when value changes
   useEffect(() => {
      valueRef.current = value;
      console.log("ImageTileUpload value changed:", { value, multiple });
   }, [value, multiple]);

   // Add tile
   if (add) {
      if (multiple) {
         const currentImages = Array.isArray(value) ? value : [];
         console.log("ImageTileUpload - currentImages:", currentImages);
         
         return (
            <div className={cn("w-full flex flex-wrap items-start gap-3", className)}>
               {currentImages.map((imageUrl, index) => (
                  <div
                     key={`${imageUrl}-${index}`}
                     className="relative aspect-video w-[300px] overflow-hidden rounded-md bg-white shadow-xs border border-dashed border-gray-400 md:w-[236px]"
                  >
                     {imageUrl ? (
                        <>
                           <Image
                              src={imageUrl}
                              alt={`Uploaded ${index + 1}`}
                              width={310}
                              height={217}
                              className="h-full w-full object-cover"
                              unoptimized
                           />
                           <div className="absolute aspect-square bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                              {index + 1}
                           </div>
                        </>
                     ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                           <span className="text-sm text-gray-500">No image</span>
                        </div>
                     )}
                     <Button
                        variant="destructive"
                        type="button"
                        onClick={(e) => {
                           e.preventDefault();
                           const newImages = currentImages.filter((_, i) => i !== index);
                           onChange(newImages.length > 0 ? newImages : []);
                        }}
                        className="absolute top-1.5 right-1.5 size-6 rounded-full cursor-pointer hover:bg-red-500"
                        title="Remove image"
                     >
                        <XIcon className="size-3" />
                     </Button>
                  </div>
               ))}
               
               {/* Show uploading progress */}
               {pending.map((item) => (
                  <div
                     key={item.id}
                     className="relative aspect-video w-[310px] overflow-hidden rounded-md bg-white shadow-xs md:w-[236px]"
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
               
               {/* Add new image button */}
               <button
                  type="button"
                  onClick={(e) => {
                     e.preventDefault();
                     inputRef.current?.click();
                  }}
                  className="flex aspect-video w-[310px] border border-dashed border-gray-400 items-center justify-center rounded-md bg-gray-50 transition-all duration-200 hover:bg-gray-50/20 md:w-[236px]"
                  title="Add images"
               >
                  <div className="flex items-center gap-1.5">
               <UploadCloud className="size-5 object-contain text-black" />

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
         <div className="w-[310px] md:w-[236px]">
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
               className={cn("aspect-video w-[310px] md:w-[236px]")}
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

   // For single file display, ensure we have a string value
   const singleValue = Array.isArray(value) ? value[0] : value;

   return (
      <div className={cn("w-[310px] md:w-[236px]", className)}>
         <FileUpload
            type={detectMediaType(singleValue || "")}
            accept={
               mediaType === "both"
                  ? "image/*,video/*"
                  : mediaType === "video"
                    ? "video/*"
                    : "image/*"
            }
            placeholder={placeholder ?? (mediaType === "video" ? "Change video" : "Change image")}
            folder={folder}
            value={singleValue ?? undefined}
            onFileChange={(p) => onChange(p)}
            onRemove={() => onChange(null)}
            className="w-[310px] md:w-[236px]"
         />
      </div>
   );
}
