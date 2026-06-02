import { createClient } from "@/utils/supabase/server";
import { BlogClient } from "@/components/blog-client";
import { getLocale, getTranslations } from "next-intl/server";
import { mapArrayToLocale } from "@/utils/locale-mapper";
import { Metadata } from 'next';

export const revalidate = 60; // Cache for 1 minute for great performance and SEO

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('blogTitle'),
    description: "Artículos sobre diseño, tecnología y tendencias.",
  };
}

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
