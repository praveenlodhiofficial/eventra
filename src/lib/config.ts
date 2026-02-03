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
};
