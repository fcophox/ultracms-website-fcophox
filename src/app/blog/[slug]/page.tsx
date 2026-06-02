import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArticleLayout } from "@/components/article-layout";
import { getLocale } from "next-intl/server";
import { mapToLocale } from "@/utils/locale-mapper";

export const revalidate = 60; // Cache pages for 1 minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  const { data: rawArticle, error } = await supabase
    .from("articles")
    .select("title, content, image_url, title_en, content_en")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .eq("status", "published")
    .single();

  if (error || !rawArticle) {
    return {
      title: "Artículo no encontrado",
      description: "Este artículo no existe o ha sido eliminado.",
    };
  }

  const article = mapToLocale(rawArticle, locale);
  const cleanExcerpt = article.content
    ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 160).trim() + "..."
    : "Descubre artículos sobre diseño, tecnología y desarrollo web.";

  return {
    title: article.title,
    description: cleanExcerpt,
    openGraph: {
      title: article.title,
      description: cleanExcerpt,
      url: `/blog/${slug}`,
      type: "article",
      siteName: "Fcophox",
      images: article.image_url
        ? [
            {
              url: article.image_url,
              width: 1200,
              height: 630,
              alt: article.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: cleanExcerpt,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
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
      category={article.category || 'Blog'}
      gradient="from-primary/20 via-primary/5 to-transparent"
      imageUrl={article.image_url}
      backHref="/blog"
      backLabel="Volver al Blog"
      itemId={article.id}
      tableName="articles"
    >
      <div 
        className="tiptap-content prose prose-lg dark:prose-invert max-w-none text-foreground/80"
        dangerouslySetInnerHTML={{ __html: article.content }} 
      />
    </ArticleLayout>
  );
}
