import { createClient } from "redis";

export const cacheClient = createClient({
  url: `redis://${process.env.CACHE_HOST}:${process.env.CACHE_PORT}`,
});
