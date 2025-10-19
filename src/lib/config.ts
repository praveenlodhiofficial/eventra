const config = {
   env: {
      apiEndpoint: (() => {
         // In production (Vercel), use the production endpoint
         if (process.env.NODE_ENV === "production") {
            return process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || "https://portfoliox-new.vercel.app";
         }
         // In development, use local endpoint
         return process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      })(),
      prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,
      databaseURL: process.env.DATABASE_URL!,
      seedUserId: process.env.SEED_USER_ID!,
      imagekit: {
         publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
         urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      },
   },
};

export default config;
