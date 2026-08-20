import { MetadataRoute } from 'next';
import { kontororu, CATEGORIA } from '@/utils/kontororu';
import { SITE_URL } from '@/utils/site';

/*
 * El sitemap incluye el contenido de Kontorōru, así que se revalida como las
 * páginas que lista: el webhook invalida la etiqueta `posts` al publicar y esto
 * se regenera con ellas.
 */
export const revalidate = 3600;

type Entrada = MetadataRoute.Sitemap[number];

const ahora = new Date();

const estaticas: Entrada[] = [
  { url: SITE_URL, changeFrequency: 'monthly', priority: 1, lastModified: ahora },
  { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/case-studies`, changeFrequency: 'monthly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/portfolio`, changeFrequency: 'monthly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/methodology`, changeFrequency: 'monthly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/resources`, changeFrequency: 'monthly', priority: 0.6, lastModified: ahora },
  { url: `${SITE_URL}/cv`, changeFrequency: 'yearly', priority: 0.5, lastModified: ahora },
  { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5, lastModified: ahora },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * Antes el sitemap sólo listaba páginas estáticas: ninguna entrada del blog
   * ni de casos de estudio aparecía. Con la migración cambiaron los slugs,
   * así que declararlos importa más que nunca — los buscadores todavía
   * conocen las URLs viejas.
   */
  const [articulos, casos] = await Promise.all([
    kontororu.posts.list({ categoria: CATEGORIA.blog, limit: 100 }),
    kontororu.posts.list({ categoria: CATEGORIA.casosDeEstudio, limit: 100 }),
  ]);

  const deContenido = (base: string, posts: Awaited<ReturnType<typeof kontororu.posts.list>>['data']): Entrada[] =>
    posts.map((p) => ({
      url: `${SITE_URL}${base}/${p.slug}`,
      // `updatedAt` es la última edición real, no la fecha del build.
      lastModified: new Date(p.updatedAt || p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    ...estaticas,
    ...deContenido('/blog', articulos.data),
    ...deContenido('/case-studies', casos.data),
  ];
}
