import { ResourcesPageContent } from "./resources-content";
import { Metadata } from "next";
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      absolute: t('homeTitle'),
    },
    description: "Explora el portafolio de Fcophox, descubre mis proyectos recientes, metodologías y artículos sobre diseño y desarrollo web.",
  };
}

export default async function ResourcesPage() {
  return (
    <main className="w-full flex-1 flex flex-col pt-8 pb-32">
      <ResourcesPageContent />
    </main>
  );
}
