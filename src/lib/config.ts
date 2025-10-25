const config = {
   env: {
      // ********************* API ENDPOINT *********************
      apiEndpoint: (() => {
         if (process.env.NODE_ENV === "production") {
            return process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || "https://portfoliox-new.vercel.app";
         }
         return process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      })(),

      // ********************* PRODUCTION API ENDPOINT *********************
      prodApiEndpoint: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT!,

      // ********************* DATABASE *********************
      databaseURL: process.env.DATABASE_URL!,

      // ********************* IMAGEKIT *********************
      imagekit: {
         publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
         urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
         privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      },

      // ********************* SESSION *********************
      session: {
         expirationSeconds: process.env.SESSION_EXPIRATION_SECONDS!,
         cookieSessionKey: process.env.COOKIE_SESSION_KEY!,
      },

      // ********************* UPSTASH REDIS CLIENT *********************
      redis: {
         url: process.env.UPSTASH_REDIS_URL!,
         token: process.env.UPSTASH_REDIS_TOKEN!,
      },

      // ********************* SEED VARIABLES *********************
      seed: {
         userId: process.env.SEED_USER_ID!,
      },
   },
};

export default config;
