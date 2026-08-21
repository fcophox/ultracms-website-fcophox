/**
 * Lectura de Kontorōru en el idioma que el visitante tiene elegido.
 *
 * El cliente de `kontororu.ts` acepta `locale`, pero es un parámetro opcional
 * y ninguna página lo pasaba: la API devuelve entonces el idioma principal del
 * espacio, así que el contenido del CMS se quedaba en español aunque el resto
 * de la interfaz cambiara a inglés. Todo lo que lea contenido debe pasar por
 * aquí, no por `kontororu.posts.*` directamente.
 *
 * El idioma sale de la cookie `NEXT_LOCALE` vía next-intl, así que cualquier
 * página que use estas funciones pasa a renderizarse dinámicamente. Es lo
 * correcto: una página cacheada estáticamente serviría el mismo idioma a todo
 * el mundo, que es justo el fallo que esto arregla.
 */
import { getLocale } from "next-intl/server";
import { kontororu, type ListaOpciones, type Post, type PostDetail } from "./kontororu";

/** Idioma principal del espacio en Kontorōru: el que se sirve sin `locale`. */
export const IDIOMA_BASE = "es";

/**
 * Listado en el idioma actual, completado con el idioma base.
 *
 * NO se devuelve sin más la lista traducida: hoy en el CMS sólo hay dos
 * entradas con versión inglesa —ambas casos de estudio— y filtrar por
 * categoría con `locale=en` devuelve cero, porque las categorías también son
 * por idioma. Servir eso tal cual dejaría /blog vacío en inglés, que es peor
 * que enseñarlo en español.
 *
 * Así que manda la lista base —orden y elenco completos— y cada entrada se
 * sustituye por su traducción cuando existe. Según se vayan traduciendo
 * entradas en Kontorōru, van apareciendo solas.
 */
export async function listarLocalizado(opciones: ListaOpciones = {}): Promise<Post[]> {
  const locale = await getLocale();

  if (locale === IDIOMA_BASE) {
    return (await kontororu.posts.list(opciones)).data;
  }

  const [base, traducidos] = await Promise.all([
    kontororu.posts.list(opciones),
    kontororu.posts.list({ ...opciones, locale }),
  ]);

  if (traducidos.data.length === 0) return base.data;

  /*
   * `translations` mapea idioma → slug, así que da el slug base de cada
   * traducción. Se recurre a su propio slug cuando no lo declara: en este
   * espacio ambos idiomas comparten slug, pero eso no está garantizado.
   */
  const porSlugBase = new Map<string, Post>();
  for (const post of traducidos.data) {
    porSlugBase.set(post.translations?.[IDIOMA_BASE] ?? post.slug, post);
  }

  return base.data.map((post) => porSlugBase.get(post.slug) ?? post);
}

/**
 * Detalle en el idioma actual, con el original como respaldo.
 *
 * Un artículo sin traducir devuelve 404 al pedirlo con `locale=en` —no la
 * versión española—, de modo que sin este respaldo cambiar de idioma en una
 * ficha la convertiría en un 404.
 */
export async function porSlugLocalizado(slug: string): Promise<PostDetail | null> {
  const locale = await getLocale();

  if (locale === IDIOMA_BASE) {
    return kontororu.posts.bySlug(slug);
  }

  const traducido = await kontororu.posts.bySlug(slug, locale);
  if (traducido) return traducido;

  const base = await kontororu.posts.bySlug(slug);
  if (!base) return null;

  // La URL puede venir del otro idioma y llevar un slug que `locale` no conoce.
  const otroSlug = base.translations?.[locale];
  if (otroSlug && otroSlug !== slug) {
    const alterno = await kontororu.posts.bySlug(otroSlug, locale);
    if (alterno) return alterno;
  }

  return base;
}
