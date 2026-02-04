"use client"; // This component must be a client component
import { useRef, useState } from "react";

import {
  Image,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { UploadIcon } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { config } from "@/lib/config";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function FileUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [progress, setProgress] = useState(0);

  // NEW: State for preview (local + ImageKit URL)
  const [preview, setPreview] = useState<string | null>(null);

  // Keep track of uploaded file to delete later if needed
  const [uploadedFile, setUploadedFile] = useState<{
    fileId: string;
    url: string;
  } | null>(null);

  // Create a ref for the file input element to access its files easily
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create an AbortController instance to provide an option to cancel the upload if needed.
  const abortController = new AbortController();

  //   =============================== AUTHENTICATOR ===============================
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  //   =============================== DELETE FROM IMAGEKIT ===============================
  const deleteFromImageKit = async (fileId: string) => {
    await fetch("/api/imagekit/delete", {
      method: "POST",
      body: JSON.stringify({ fileId }),
    });
  };

  //   =============================== HANDLE UPLOAD ===============================
  const handleUpload = async (file: File) => {
    // show LOCAL preview instantly
    setPreview(URL.createObjectURL(file));

    // delete previous uploaded image if exists
    if (uploadedFile) {
      await deleteFromImageKit(uploadedFile.fileId);
      setUploadedFile(null);
    }

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return;
    }
    const { signature, expire, token, publicKey } = authParams;

    try {
      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,

        folder: "eventra/events",
        tags: ["eventra", "events"],
        useUniqueFileName: true,

        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      if (!uploadResponse.url || !uploadResponse.fileId) {
        throw new Error("Upload response is missing URL or fileId");
      }

      console.log("Upload response:", uploadResponse);

      // Replace local preview with ImageKit CDN preview
      setPreview(uploadResponse.url);

      setUploadedFile({
        fileId: uploadResponse.fileId,
        url: uploadResponse.url,
      });

      onUploaded(uploadResponse.url);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 md:max-w-50">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-zinc-200"
      >
        {/* Green progress overlay that does NOT block clicks */}
        <Progress
          value={progress}
          max={100}
          className="pointer-events-none absolute inset-0 z-10 h-full rounded-none"
          indicatorClassName="bg-green-500/50"
        />

        {/* Preview using ImageKit Image */}
        {preview ? (
          <Image
            urlEndpoint={config.imagekit.url_endpoint}
            src={preview}
            alt="preview"
            fill
            className="z-10 object-cover"
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

      {/* Hidden input — still used, but invisible */}
      <Input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setProgress(0);
            setPreview(null);
            handleUpload(file);
          }
          e.target.value = "";
        }}
      />

      <Button type="button" onClick={() => fileInputRef.current?.click()}>
        Choose file
      </Button>
    </div>
  );
}
