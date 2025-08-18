import { xai } from "@ai-sdk/xai";
import { generateObject } from "ai";
import { object, z } from "zod";

export async function checkSpam(content: string) {
  const { object } = await generateObject({
    model: xai("grok-2"),
    schema: z.object({
      isSpam: z.boolean(),
    }),
    prompt: `Analyze if the following content is spam. Content: "${content}"`,
  });

  return object.isSpam;
}
