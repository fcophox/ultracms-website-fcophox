import { CaseStudiesClient } from "@/components/case-studies-client";
import { getLocale, getTranslations } from "next-intl/server";
import { CATEGORIA } from "@/utils/kontororu";
import { listarLocalizado } from "@/utils/kontororu-i18n";
import { aListadoArray } from "@/utils/kontororu-adapter";
import { Metadata } from 'next';

export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('caseStudiesTitle'),
    description: "Explora una selección de mis proyectos y casos de estudio donde he aplicado diseño, estrategia y código.",
  };
}

export default async function CasosDeEstudioPage() {
  const posts = await listarLocalizado({
    categoria: CATEGORIA.casosDeEstudio,
    limit: 100,
  });

  return <CaseStudiesClient cases={aListadoArray(posts)} />;
}
