/**
 * Redirecciones 301 de las URLs anteriores a la migración a Kontorōru.
 *
 * Los slugs cambiaron al importar el contenido y no se pueden devolver a su
 * forma original: `slugify` del CMS recorta a 80 caracteres (src/lib/content/slug.ts)
 * y ese recorte también se aplica en el campo del editor. Cinco de estas
 * entradas apuntan a un slug cortado a media palabra; es lo que hay.
 *
 * El resto proviene de dos causas: la importación adoptó el `slug_en` de la
 * fila de Supabase, y los slugs con mayúsculas se normalizaron.
 *
 * Las URLs en inglés se incluyen porque HOY responden en producción: la
 * consulta de `blog/[slug]/page.tsx` hacía `.or(slug.eq.X,slug_en.eq.X)`, así
 * que ambas formas están indexadas.
 *
 * ⚠️ **Aquí NO van los slugs que sólo cambian de mayúsculas.** El `source` de
 * `redirects()` se compara sin distinguir capitalización, así que una entrada
 * como `the-winter-of-UX-…` → `the-winter-of-ux-…` se captura a sí misma y
 * produce un bucle infinito: la URL correcta deja de ser alcanzable. Esos casos
 * los resuelve la normalización a minúsculas de las páginas `[slug]`.
 *
 * Generado el 2026-08-20 cruzando GET /posts contra MIGRACION_LIKES.md.
 * No editar a mano: si cambia un slug en el CMS, regenerar.
 */

export interface SlugRedirect {
  /** Prefijo de ruta: /blog o /case-studies */
  base: string;
  /** Slug anterior, tal cual estaba indexado */
  from: string;
  /** Slug actual en Kontorōru */
  to: string;
}

export const SLUG_REDIRECTS: SlugRedirect[] = [
  { base: "/blog", from: "beyond-spying-on-the-competition-5-benchmarking-ideas-that-will-change-your-strategy", to: "beyond-spying-on-the-competition-5-benchmarking-ideas-that-will-change-your-stra" },
  { base: "/blog", from: "is-your-app-or-website-a-labyrinth-discover-how-card-sorting-gives-you-the-map-to-guide-your-users", to: "is-your-app-or-website-a-labyrinth-discover-how-card-sorting-gives-you-the-map-t" },
  { base: "/blog", from: "is-your-digital-product-not-working-and-you-dont-know-why-keys-to-heuristic-analysis-that-perhaps-you-did-not-know", to: "is-your-digital-product-not-working-and-you-dont-know" },
  { base: "/blog", from: "the-design-system-is-no-longer-a-library-it-is-the-source-that-the-machine-will-read", to: "the-design-system-is-no-longer-a-library-it-is-the-source-that-the-machine-will" },
  { base: "/blog", from: "the-self-explanatory-design-why-the-5-second-test-is-the-essential-tuner-of-your-digital-product", to: "the-self-explanatory-design-why-the-5-second-test-is-the-essential-tuner-of-your" },
  { base: "/case-studies", from: "a-community-of-cyclists-to-share-and-discover-routes", to: "community-of-cyclists-to-share-and-discover-routes" },
  { base: "/case-studies", from: "digital-menu-service-for-pizzerias", to: "digital-menu-service-for-pizzeria" },
  { base: "/case-studies", from: "postpandemic-It-talent-recruitment-management", to: "post-pandemic-it-talent-recruitment-management" },
  { base: "/case-studies", from: "support-community-for-people-with-food-allergies", to: "community-for-people-with-food-allergies" },
];
