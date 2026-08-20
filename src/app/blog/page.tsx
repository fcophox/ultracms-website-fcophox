import { BlogClient } from "@/components/blog-client";
import { getLocale, getTranslations } from "next-intl/server";
import { kontororu, CATEGORIA } from "@/utils/kontororu";
import { aListadoArray } from "@/utils/kontororu-adapter";
import { Metadata } from 'next';

/*
 * Una hora, no un minuto: la invalidación ya no depende del reloj sino del
 * webhook de Kontorōru, que revalida la etiqueta `posts` al publicar. Esto es
 * sólo la red de seguridad por si una entrega se pierde.
 */
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('blogTitle'),
    description: "Artículos sobre diseño, tecnología y tendencias.",
  };
}

export default async function BlogPage() {
  const { data: posts } = await kontororu.posts.list({
    categoria: CATEGORIA.blog,
    limit: 100,
  });

  return <BlogClient articles={aListadoArray(posts)} />;
}
