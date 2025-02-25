import { createClient } from "redis";

export const cacheClient = createClient({
  url: `redis://${process.env.CACHE_HOST || "localhost"}:${
    process.env.CACHE_PORT || 6379
  }`,
});
