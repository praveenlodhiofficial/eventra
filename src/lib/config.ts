const config = {
   env: {
      // ********************* SITE URL (for emails/links) *********************
      siteUrl: (() => {
         if (process.env.NODE_ENV === "production") {
            return process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || "https://eventra.praveenlodhi.me";
         }
         if (process.env.VERCEL_URL) {
            return process.env.VERCEL_URL || "https://eventra-beta.vercel.app";
         }
         return process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
      })(),

      // ********************* API ENDPOINT (for server actions) *********************
      apiEndpoint: (() => {
         if (process.env.NODE_ENV === "production") {
            return process.env.NEXT_PUBLIC_PROD_API_ENDPOINT || "https://eventra-beta.vercel.app";
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

      // ********************* RESEND *********************
      resend: {
         apiKey: process.env.RESEND_API_KEY!,
      },
   },
};

export default config;
