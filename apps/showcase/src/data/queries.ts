import { createClient } from "@/utils/supabase/admin-client";

export async function getUserProfile(slug: string, userId?: string) {
  const supabase = await createClient();

  const query = supabase
    .from("users")
    .select(
      "id, name, image, status, bio, work, website, slug, social_x_link, created_at, public, posts(*, votes(id))",
    )
    .eq("slug", slug);

  if (userId) {
    query.eq("id", userId);
  } else {
    query.eq("public", true);
  }

  const { data } = await query.single();

  if (!data) {
    return {
      data: null,
    };
  }

  return {
    data: {
      ...data,
      posts: data?.posts
        ?.sort(
          (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .map((post: { votes: { id: string }[] }) => ({
          ...post,
          user_avatar: data.image,
          user_name: data.name,
          vote_count: post.votes.length,
        })),
    },
  };
}

export async function getPopularPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_popular_posts");

  if (error) {
    console.error(error);
  }

  return {
    data,
  };
}

export async function getFeaturedJobs({
  onlyPremium,
}: {
  onlyPremium?: boolean;
} = {}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .limit(100)
    .order("order", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("active", true)
    .or(onlyPremium ? "plan.eq.premium" : "plan.eq.featured,plan.eq.premium");

  return {
    // Shuffle the data
    data: data?.sort(() => Math.random() - 0.5),
    error,
  };
}

export async function getJobs() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .limit(1000) // TODO: Pagination
    .order("created_at", { ascending: false })
    .eq("active", true);

  return { data, error };
}

export async function getJobsByCompany(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*, companies!inner(*)")
    .eq("companies.slug", slug)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getJobById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*)")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getFeaturedMCPs({
  onlyPremium,
}: {
  onlyPremium?: boolean;
} = {}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mcps")
    .select("*")
    .limit(100)
    .order("created_at", { ascending: false })
    .order("order", { ascending: false })
    .order("created_at", { ascending: false })
    .eq("active", true)
    .or(onlyPremium ? "plan.eq.premium" : "plan.eq.featured,plan.eq.premium");

  return {
    // Shuffle the data
    data: data?.sort(() => Math.random() - 0.5),
    error,
  };
}
