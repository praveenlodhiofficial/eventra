import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   turbopack: {
      root: "C:\\Users\\Praveen Lodhi\\Desktop\\eventra",
   },
   images: {
      remotePatterns: [
         {
            protocol: "https",
            hostname: "**",
         },
      ],
   },
};

export default nextConfig;
