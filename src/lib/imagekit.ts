import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

export const authenticator = async () => {
  const res = await fetch("/api/imagekit/upload-auth");
  if (!res.ok) throw new Error("Auth failed");
  return res.json();
};

export const uploadToImageKit = async (
  file: File,
  folder: string,
  onProgress?: (p: number) => void
) => {
  const { signature, expire, token, publicKey } = await authenticator();

  try {
    const res = await upload({
      file,
      fileName: file.name,
      folder,
      useUniqueFileName: true,
      signature,
      expire,
      token,
      publicKey,
      onProgress: (e) => {
        onProgress?.((e.loaded / e.total) * 100);
      },
    });

    return res; // contains fileId, url, etc.
  } catch (error) {
    if (
      error instanceof ImageKitAbortError ||
      error instanceof ImageKitInvalidRequestError ||
      error instanceof ImageKitUploadNetworkError ||
      error instanceof ImageKitServerError
    ) {
      throw error;
    }
    throw error;
  }
};

export const deleteFromImageKit = async (fileId: string) => {
  await fetch("/api/imagekit/delete", {
    method: "POST",
    body: JSON.stringify({ fileId }),
  });
};
