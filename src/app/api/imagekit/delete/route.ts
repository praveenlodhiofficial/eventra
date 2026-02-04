import ImageKit from "imagekit";

import { config } from "@/lib/config";

const imagekit = new ImageKit({
  publicKey: config.imagekit.public_key,
  privateKey: config.imagekit.private_key,
  urlEndpoint: config.imagekit.url_endpoint,
});

export async function POST(req: Request) {
  const { fileId } = await req.json();

  await imagekit.deleteFile(fileId);

  return Response.json({ success: true });
}
