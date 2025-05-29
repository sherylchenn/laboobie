"use server";

import { createMCPListingCheckoutSession } from "@/lib/polar";
import { createPostRatelimit } from "@/lib/ratelimit";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authActionClient } from "./safe-action";

export const createMCPListingAction = authActionClient
  .metadata({
    actionName: "create-mcp-listing",
  })
  .schema(
    z.object({
      name: z.string(),
      company_id: z.string().nullable(),
      logo: z.string().nullable(),
      description: z.string(),
      link: z.string().url(),
      plan: z.enum(["standard", "featured", "premium"]),
    }),
  )
  .action(
    async ({
      parsedInput: { name, company_id, logo, description, link, plan },
      ctx: { userId, email, name: customerName },
    }) => {
      const supabase = await createClient();

      const { success } = await createPostRatelimit.limit(
        `create-mcp-listing-${userId}`,
      );

      if (!success) {
        throw new Error("Too many requests. Please try again later.");
      }

      const { data: existingMCP } = await supabase
        .from("mcps")
        .select()
        .eq("link", link)
        .limit(1);

      if (existingMCP && existingMCP.length > 0) {
        throw new Error("This URL has already been submitted.");
      }

      const { data, error } = await supabase
        .from("mcps")
        .insert({
          name,
          company_id,
          logo,
          description,
          link,
          plan,
          active: plan === "standard",
        })
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      revalidatePath("/mcp");

      const { data: mcp } = await supabase
        .from("mcps")
        .select("slug")
        .eq("id", data.id)
        .single();

      if (plan === "standard" && mcp) {
        redirect(`/mcp/${mcp.slug}`);
      }

      const session = await createMCPListingCheckoutSession({
        plan,
        mcpListingId: data.id,
        companyId: company_id ?? "",
        email: email ?? "",
        customerName: customerName ?? "",
      });

      redirect(session.url);
    },
  );
