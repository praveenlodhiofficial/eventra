"use client";

import { Button } from "@/components/ui/button";
import useSingleFileUpload from "@/hooks/useSingleFileUpload";
import config from "@/lib/config";
import { cn } from "@/lib/utils";
import { Image as IKImage, Video as IKVideo } from "@imagekit/next";
import { UploadCloud, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Get ImageKit config - handle potential undefined values
const getImageKitConfig = () => {
   try {
      return {
         publicKey: config.env.imagekit.publicKey,
         urlEndpoint: config.env.imagekit.urlEndpoint,
      };
   } catch (error) {
      console.error("Error loading ImageKit config:", error);
      return {
         publicKey: "",
         urlEndpoint: "",
      };
   }
};

interface FileUploadProps {
   type: "image" | "video" | "file";
   accept: string;
   placeholder: string;
   folder: string;
   onFileChange: (filePath: string) => void;
   value?: string;
   className?: string;
   onRemove?: () => void; // called when user clicks remove button
   objectFit?: "cover" | "contain"; // control media fit inside preview
   mediaClassName?: string; // extra classes for IKImage/IKVideo
   aspectRatio?: "16:9" | "4:3" | "1:1" | "9:16"; // control media aspect ratio
   disabled?: boolean; // disable file upload functionality
}

const FileUpload = ({
   type,
   accept,
   placeholder,
   folder,
   onFileChange,
   value,
   className,
   onRemove,
   objectFit = "cover",
   aspectRatio = "16:9",
   mediaClassName,
   disabled = false,
}: FileUploadProps) => {
   const fileInputRef = useRef<HTMLInputElement>(null);
   const [file, setFile] = useState<{ filePath: string | null }>({
      filePath: value ?? null,
   });
   const [progress, setProgress] = useState(0);
   const [isUploading, setIsUploading] = useState(false);

   // Sync internal state with value prop changes
   useEffect(() => {
      setFile({ filePath: value ?? null });
   }, [value]);

   // Get ImageKit config
   const { urlEndpoint } = getImageKitConfig();

   // const styles = {
   //    button: "bg-light-600 border-gray-100 border",
   //    placeholder: "text-foreground text-sm",
   //    text: "text-dark-400",
   // };

   const onError = (error: Error) => {
      console.error("File upload error:", error);
      setIsUploading(false);
      setProgress(0);

      toast.error(`${type} upload failed`, {
         description: `Your ${type} could not be uploaded. Please try again.`,
      });
   };

   const onSuccess = (res: { filePath?: string }) => {
      if (!res.filePath) {
         console.error("Upload succeeded but no filePath returned");
         return;
      }
      const fullUrl = `${urlEndpoint}${res.filePath}`;
      setFile({ filePath: fullUrl });
      onFileChange(fullUrl);
      setIsUploading(false);
      setProgress(0);

      toast.success(`${type} uploaded successfully`, {
         description: `${res.filePath} uploaded successfully!`,
      });
   };

   const onValidate = (file: File) => {
      if (type === "image") {
         if (file.size > 20 * 1024 * 1024) {
            toast.error("File size too large", {
               description: "Please upload a file that is less than 20MB in size",
            });

            return false;
         }
      } else if (type === "video") {
         if (file.size > 50 * 1024 * 1024) {
            toast.error("File size too large", {
               description: "Please upload a file that is less than 50MB in size",
            });
            return false;
         }
      } else if (type === "file") {
         if (file.size > 10 * 1024 * 1024) {
            toast.error("File size too large", {
               description: "Please upload a file that is less than 10MB in size",
            });
            return false;
         }
      }

      return true;
   };

   const { isUploading: isUploadingHook, startUpload } = useSingleFileUpload({
      type,
      folder,
      onProgress: (p) => setProgress(p),
      onSuccess: onSuccess,
      onError,
   });

   useEffect(() => {
      setIsUploading(isUploadingHook);
   }, [isUploadingHook]);

   const handleFileUpload = async (selectedFile: File) => {
      if (!onValidate(selectedFile)) return;
      await startUpload(selectedFile);
   };

   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
         handleFileUpload(selectedFile);
      }
   };

   return (
      <>
         <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
         />

         {!file.filePath ? (
            <Button
               variant="ghost"
               className={cn(
                  "relative flex min-h-9 w-full items-center justify-center gap-1.5 overflow-hidden rounded-md bg-white text-sm font-light shadow-xs transition-all duration-200 focus:outline-none",
                  className
               )}
               onClick={(e) => {
                  e.preventDefault();
                  if (fileInputRef.current && !disabled) {
                     fileInputRef.current.click();
                  }
               }}
               disabled={isUploading || disabled}
            >
               {/* Progress bar background */}
               {isUploading && (
                  <div className="absolute inset-0 bg-green-100 transition-all duration-300 ease-out" />
               )}

               {/* Progress bar fill */}
               {isUploading && (
                  <div
                     className="absolute inset-0 bg-green-300 transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                  />
               )}

               <UploadCloud className="size-5 object-contain text-black" />

               <p className={cn("text-foreground relative z-9 text-sm")}>
                  {isUploading
                     ? `${progress}% Uploading...`
                     : disabled
                       ? "File uploaded - cannot be changed"
                       : placeholder}
               </p>
            </Button>
         ) : (
            <div className={cn("relative", className)}>
               <div
                  className={cn(
                     "relative w-full overflow-hidden rounded-md border",
                     aspectRatio === "16:9"
                        ? "aspect-video"
                        : aspectRatio === "4:3"
                          ? "aspect-4/3"
                          : aspectRatio === "1:1"
                            ? "aspect-square"
                            : aspectRatio === "9:16"
                              ? "aspect-9/16"
                              : "aspect-video"
                  )}
               >
                  {type === "image" ? (
                     <IKImage
                        src={file.filePath}
                        urlEndpoint={urlEndpoint}
                        alt={file.filePath}
                        width={400}
                        height={225}
                        className={cn(
                           "h-full w-full",
                           objectFit === "contain" ? "object-contain" : "object-cover",
                           mediaClassName
                        )}
                     />
                  ) : type === "video" ? (
                     <IKVideo
                        src={file.filePath}
                        urlEndpoint={urlEndpoint}
                        controls={true}
                        className={cn(
                           "h-full w-full",
                           objectFit === "contain" ? "object-contain" : "object-cover",
                           mediaClassName
                        )}
                     />
                  ) : type === "file" ? (
                     <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 p-4">
                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                           <svg
                              className="h-8 w-8 text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth={2}
                                 d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                              />
                           </svg>
                        </div>
                        <p className="text-sm font-medium text-gray-900">PDF Document</p>
                        <p className="text-xs text-gray-500">Click to view/download</p>
                        <a
                           href={file.filePath}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="mt-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                        >
                           Open PDF
                        </a>
                     </div>
                  ) : null}

                  {/* Remove file overlay button */}
                  {!disabled && (
                     <Button
                        variant="secondary"
                        onClick={(e) => {
                           e.preventDefault();
                           // Clear current file and notify parent
                           setFile({ filePath: null });
                           try {
                              onFileChange("");
                           } catch {}
                           if (onRemove) onRemove();
                        }}
                        className="absolute top-1.5 right-1.5 aspect-square size-7 rounded-full bg-white/30 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/40"
                        title="Remove file"
                     >
                        <XIcon className="size-1 scale-400 rounded-full" />
                     </Button>
                  )}
               </div>
            </div>
         )}

         {/* Progress is now shown inside the button */}
      </>
   );
};

export default FileUpload;
