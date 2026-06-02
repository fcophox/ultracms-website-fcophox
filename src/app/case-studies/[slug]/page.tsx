import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArticleLayout } from "@/components/article-layout";
import { getLocale } from "next-intl/server";
import { mapToLocale } from "@/utils/locale-mapper";

export const revalidate = 60; // Cache pages for 1 minute

interface PageProps {
  params: Promise<{ slug: string }>;
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
      gradient="from-blue-500/40 to-cyan-400/40"
      imageUrl={caseStudy.image_url}
      backHref="/case-studies"
      backLabel="Volver al Portafolio"
    >
      <div 
        className="tiptap-content text-foreground/60"
        dangerouslySetInnerHTML={{ __html: caseStudy.content }} 
      />
    </ArticleLayout>
  );
}
