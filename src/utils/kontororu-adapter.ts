/**
 * Traduce el `Post` de Kontorōru a la forma que ya esperan los componentes de
 * presentación (`Article` de blog-client, `CaseStudy` de case-studies-client).
 *
 * Se adapta en vez de reescribir esos componentes: su contrato no tiene nada de
 * malo, sólo cambió de dónde salen los datos. Tocarlos habría mezclado el
 * cambio de origen con un rediseño y hecho la revisión mucho más difícil.
 */
import type { Post, PostDetail } from "./kontororu";

export interface ContenidoListado {
  id: string;
  title: string;
  slug: string;
  /** Texto plano para la tarjeta. Los componentes le aplican un strip de HTML. */
  content: string;
  image_url?: string | null;
  category: string;
  status: string;
  published_at?: string | null;
  created_at?: string | null;
  tags?: string[] | null;
  likes?: number | null;
}

/**
 * El chip de filtro, por orden de preferencia.
 *
 * En Supabase `category` era un valor por entrada —"Academy", "UX", "App"— y es
 * lo que alimenta los chips. En Kontorōru `category` es el TIPO de contenido
 * (`blog` / `casos-de-estudio`), igual para todas las entradas de una sección:
 * usarlo deja el filtro en un solo botón.
 *
 * El sitio natural de esa taxonomía son las etiquetas, y la API ya las
 * devuelve y sabe filtrar por ellas (`?tag=`)... pero **el panel todavía no
 * permite asignarlas**: `tags` y `post_tags` existen en el esquema del CMS y no
 * hay ninguna escritura sobre ellas en el código. Hasta que la haya, se usa un
 * campo personalizado, que el editor sí soporta.
 *
 * El orden importa: cuando existan las etiquetas pasarán a mandar solas sin
 * tocar nada, y el campo personalizado se podrá retirar.
 *
 * La taxonomía anterior está en MIGRACION_TAXONOMIA.md.
 */
function chipDe(post: Post): string {
  const personalizado = post.customFields?.categoria;
  if (typeof personalizado === "string" && personalizado.trim()) {
    return personalizado.trim();
  }
  return post.tags[0]?.name ?? post.category?.name ?? "";
}

export function aListado(post: Post): ContenidoListado {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    /*
     * El listado de la API no trae cuerpo —a propósito, para no multiplicar el
     * peso de la respuesta—, así que la tarjeta usa `excerpt`. Es mejor que lo
     * que había: antes se recortaba el HTML a ciegas a 160 caracteres.
     */
    content: post.excerpt ?? "",
    image_url: post.cover?.url ?? null,
    category: chipDe(post),
    status: "published", // la API sólo sirve publicado
    published_at: post.publishedAt,
    created_at: post.publishedAt,
    tags: post.tags.map((t) => t.name),
    likes: null, // ahora vive en el complemento Reacciones, por slug
  };
}

export function aListadoArray(posts: Post[]): ContenidoListado[] {
  return posts.map(aListado);
}

/**
 * Resumen para `<meta name="description">` y Open Graph.
 *
 * Prefiere lo que el editor escribió —`seo.description`, luego `excerpt`— y
 * sólo recorta el HTML como último recurso. Antes siempre se recortaba a
 * ciegas, lo que producía descripciones cortadas a media frase.
 */
export function resumenDe(post: PostDetail, max = 160): string {
  const escrito = post.seo?.description?.trim() || post.excerpt?.trim();
  if (escrito) return escrito;

  const plano = (post.content?.html ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (plano.length <= max) return plano;
  return plano.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
