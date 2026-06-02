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

  const { data: rawCase, error } = await supabase
    .from("case_studies")
    .select("title, content, image_url, title_en, content_en")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .eq("status", "published")
    .single();

  if (error || !rawCase) {
    return {
      title: "Caso de Estudio no encontrado",
      description: "Este caso de estudio no existe o ha sido eliminado.",
    };
  }

  const caseStudy = mapToLocale(rawCase, locale);
  const cleanExcerpt = caseStudy.content
    ? caseStudy.content.replace(/<[^>]*>?/gm, '').substring(0, 160).trim() + "..."
    : "Descubre mis casos de estudio y procesos de diseño UI/UX.";

  return {
    title: caseStudy.title,
    description: cleanExcerpt,
    openGraph: {
      title: caseStudy.title,
      description: cleanExcerpt,
      url: `/case-studies/${slug}`,
      type: "article",
      siteName: "Fcophox",
      images: caseStudy.image_url
        ? [
            {
              url: caseStudy.image_url,
              width: 1200,
              height: 630,
              alt: caseStudy.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: caseStudy.title,
      description: cleanExcerpt,
      images: caseStudy.image_url ? [caseStudy.image_url] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const locale = await getLocale();

  // Fetch the case study by slug
  const { data: rawCaseStudy, error } = await supabase
    .from("case_studies")
    .select("*")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .eq("status", "published")
    .single();

  if (error || !rawCaseStudy) {
    console.error(`Case study not found with slug '${slug}':`, error);
    notFound();
  }
  
  const caseStudy = mapToLocale(rawCaseStudy, locale);

  // Generate a clean excerpt for description
  const cleanExcerpt = caseStudy.content 
    ? caseStudy.content.replace(/<[^>]*>/g, '').slice(0, 160).trim() + "..."
    : "";

  // Year formatter
  const formatYear = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

  return (
    <ArticleLayout
      title={caseStudy.title}
      description={cleanExcerpt}
      date={formatYear(caseStudy.published_at || caseStudy.created_at)}
      category={caseStudy.category}
      gradient="from-secondary/20 via-secondary/5 to-transparent"
      imageUrl={caseStudy.image_url}
      backHref="/case-studies"
      backLabel="Volver al Portafolio"
      itemId={caseStudy.id}
      tableName="case_studies"
    >
      <div 
        className="tiptap-content prose prose-lg dark:prose-invert max-w-none text-foreground/80"
        dangerouslySetInnerHTML={{ __html: caseStudy.content }} 
      />
    </ArticleLayout>
  );
}
