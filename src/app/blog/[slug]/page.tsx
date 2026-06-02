import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArticleLayout } from "@/components/article-layout";
import { getLocale } from "next-intl/server";
import { mapToLocale } from "@/utils/locale-mapper";

export const revalidate = 60; // Cache pages for 1 minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  // Fetch the article by slug
  const { data: rawArticle, error } = await supabase
    .from("articles")
    .select("*")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .eq("status", "published")
    .single();

  if (error || !rawArticle) {
    console.error(`Article not found with slug '${slug}':`, error);
    notFound();
  }
  
  const article = mapToLocale(rawArticle, locale);

  // Generate a clean excerpt for description
  const cleanExcerpt = article.content 
    ? article.content.replace(/<[^>]*>/g, '').slice(0, 160).trim() + "..."
    : "";

  // Date formatter
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <ArticleLayout
      title={article.title}
      description={cleanExcerpt}
      date={formatDate(article.published_at || article.created_at)}
      category={article.category}
      gradient="from-primary/40 to-secondary/40"
      imageUrl={article.image_url}
      backHref="/blog"
      backLabel="Volver al Blog"
    >
      <div 
        className="tiptap-content text-foreground/60"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </ArticleLayout>
  );
}
