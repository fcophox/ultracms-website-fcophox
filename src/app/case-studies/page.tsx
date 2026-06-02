import { createClient } from "@/utils/supabase/server";
import { CaseStudiesClient } from "@/components/case-studies-client";
import { getLocale } from "next-intl/server";
import { mapArrayToLocale } from "@/utils/locale-mapper";

export const revalidate = 60; // Cache for 1 minute for great performance and SEO

export const metadata = {
  title: "Casos de Estudio | Francisco Hormazábal - UX Product Designer & Frontend Dev",
  description: "Una selección de proyectos digitales donde aplico estrategia, diseño UX/UI e ingeniería frontend.",
};

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
