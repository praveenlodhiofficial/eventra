export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  ngrok: {
    auth_token: process.env.NGROK_AUTH_TOKEN!,
  },
  session: {
    secret: process.env.SESSION_SECRET!,
    expiration: process.env.SESSION_EXPIRATION_TIME!,
  },
  imagekit: {
    private_key: process.env.IMAGEKIT_PRIVATE_KEY!,
    public_key: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    url_endpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  },
};
