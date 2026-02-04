import { getUploadAuthParams } from "@imagekit/next/server";

import { config } from "@/lib/config";
import { corsOptionsResponse, getCorsHeaders } from "@/lib/utils";

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: config.imagekit.private_key,
      publicKey: config.imagekit.public_key,
    });

    return Response.json(
      {
        token,
        expire,
        signature,
        publicKey: config.imagekit.public_key,
      },
      { headers: getCorsHeaders() }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        error: "Failed to generate upload auth",
      },
      { status: 500, headers: getCorsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return corsOptionsResponse();
}
