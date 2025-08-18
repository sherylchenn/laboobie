"use server";

import { redis } from "@showcase/kv/redis";
import { headers } from "next/headers";
import { z } from "zod";
import { actionClient } from "./safe-action";

export const voteAction = actionClient
  .schema(
    z.object({
      slug: z.string(),
    }),
  )
  .action(async ({ parsedInput: { slug } }) => {
    const clientIP = await headers().then((headers) =>
      headers.get("x-forwarded-for"),
    );

    const hasVoted = await redis.sadd(`samples:${slug}:ip:${clientIP}`, true);

    if (!hasVoted) {
      throw new Error("You have already voted");
    }

    await redis.incr(`samples:${slug}`);
  });
