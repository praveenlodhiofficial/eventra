import ImageKit from "imagekit";

import { config } from "@/lib/config";

const imagekit = new ImageKit({
  publicKey: config.imagekit.public_key,
  privateKey: config.imagekit.private_key,
  urlEndpoint: config.imagekit.url_endpoint,
});

export async function POST(req: Request) {
  const { fileId } = await req.json();

  if (!fileId) {
    return Response.json(
      { success: false, message: "fileId is required" },
      { status: 400 }
    );
  }

  let idToDelete = fileId as string;

  // If a full URL was provided instead of a raw fileId,
  // try to resolve it to a fileId using ImageKit's list/search API.
  if (typeof fileId === "string" && fileId.startsWith("http")) {
    try {
      const fileUrl = new URL(fileId);
      const endpointUrl = new URL(config.imagekit.url_endpoint);

      if (fileUrl.origin === endpointUrl.origin) {
        let filePath = fileUrl.pathname;

        // Remove leading slash if present so it matches ImageKit's filePath
        if (filePath.startsWith("/")) {
          filePath = filePath.slice(1);
        }

        const files = (await imagekit.listFiles({
          searchQuery: `filePath="${filePath}"`,
          limit: 1,
        })) as Array<{ fileId?: string }>;

        if (Array.isArray(files) && files.length > 0 && files[0]?.fileId) {
          idToDelete = files[0]!.fileId as string;
        }
      }
    } catch {
      // If URL parsing or lookup fails, fall back to using the original value.
    }
  }

  await imagekit.deleteFile(idToDelete);

  return Response.json({ success: true });
}
