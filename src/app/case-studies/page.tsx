import { createClient } from "@/utils/supabase/server";
import { CaseStudiesClient } from "@/components/case-studies-client";
import { getLocale, getTranslations } from "next-intl/server";
import { mapArrayToLocale } from "@/utils/locale-mapper";
import { Metadata } from 'next';

export const revalidate = 60; // Cache for 1 minute for great performance and SEO

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('caseStudiesTitle'),
    description: "Explora una selección de mis proyectos y casos de estudio donde he aplicado diseño, estrategia y código.",
  };
}

export default async function CasosDeEstudioPage() {
  const supabase = await createClient();
  const locale = await getLocale();

  // Fetch published case studies
  const { data: casesData, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching case studies from Supabase:", error);
  }
  
  const cases = mapArrayToLocale(casesData || [], locale);

  return <CaseStudiesClient cases={cases} />;
}
