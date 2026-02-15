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
  mapbox: {
    access_token: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!,
  },
  mojoauth: {
    client_id: process.env.MOJOAUTH_CLIENT_ID!,
    client_secret: process.env.MOJOAUTH_CLIENT_SECRET!,
    issuer: process.env.MOJOAUTH_ISSUER!,
    redirect_url: process.env.MOJOAUTH_REDIRECT_URL!,
  },
  razorpay: {
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_ID,
    webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },
};
