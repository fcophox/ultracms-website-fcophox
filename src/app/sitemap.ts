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
  { url: `${SITE_URL}/methodology`, changeFrequency: 'monthly', priority: 0.8, lastModified: ahora },
  { url: `${SITE_URL}/resources`, changeFrequency: 'monthly', priority: 0.6, lastModified: ahora },
  { url: `${SITE_URL}/cv`, changeFrequency: 'yearly', priority: 0.5, lastModified: ahora },
  { url: `${SITE_URL}/contact`, changeFrequency: 'yearly', priority: 0.5, lastModified: ahora },
];

type Posts = Awaited<ReturnType<typeof kontororu.posts.list>>['data'];

const deContenido = (base: string, posts: Posts): Entrada[] =>
  posts.map((p) => ({
    url: `${SITE_URL}${base}/${p.slug}`,
    // `updatedAt` es la última edición real, no la fecha del build.
    lastModified: new Date(p.updatedAt || p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * Antes el sitemap sólo listaba páginas estáticas: ninguna entrada del blog
   * ni de casos de estudio aparecía. Con la migración cambiaron los slugs,
   * así que declararlos importa más que nunca — los buscadores todavía
   * conocen las URLs viejas.
   *
   * Esta ruta se prerenderiza, así que la llamada ocurre EN EL BUILD. Sin el
   * try/catch, una clave ausente o un fallo pasajero de Kontorōru aborta el
   * despliegue entero: fue lo que pasó en el primer intento, en un preview que
   * no tenía las variables de entorno.
   *
   * Un sitemap temporalmente incompleto es un problema de SEO acotado y que se
   * corrige solo en la siguiente revalidación. Un build roto bloquea todo.
   */
  let contenido: Entrada[] = [];

  try {
    const [articulos, casos] = await Promise.all([
      kontororu.posts.list({ categoria: CATEGORIA.blog, limit: 100 }),
      kontororu.posts.list({ categoria: CATEGORIA.casosDeEstudio, limit: 100 }),
    ]);

    contenido = [
      ...deContenido('/blog', articulos.data),
      ...deContenido('/case-studies', casos.data),
    ];
  } catch (error) {
    console.error(
      '[sitemap] No se pudo leer el contenido de Kontorōru; se emiten sólo las ' +
      'páginas estáticas. Revisa KONTORORU_URL y KONTORORU_API_KEY en este entorno.',
      error,
    );
  }

  return [...estaticas, ...contenido];
}
