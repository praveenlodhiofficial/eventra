import config from "@/lib/config";
import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
   url: config.env.redis.url,
   token: config.env.redis.token,
});
