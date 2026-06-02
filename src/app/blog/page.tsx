import { createClient } from "@/utils/supabase/server";
import { BlogClient } from "@/components/blog-client";
import { getLocale } from "next-intl/server";
import { mapArrayToLocale } from "@/utils/locale-mapper";

export const revalidate = 60; // Cache for 1 minute for great performance and SEO

export const metadata = {
  title: "Blog | Francisco Hormazábal - UX Product Designer & Frontend Dev",
  description: "Artículos, reflexiones y aprendizajes sobre diseño de experiencia de usuario, tecnología y desarrollo frontend.",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const locale = await getLocale();
  
  // Fetch published articles
  const { data: articlesData, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles from Supabase:", error);
  }
  
  const articles = mapArrayToLocale(articlesData || [], locale);

  return <BlogClient articles={articles} />;
}
