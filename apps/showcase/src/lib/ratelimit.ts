import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./kv";

export const generateSampleRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1m"),
});

export const createPostRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "1m"),
});
