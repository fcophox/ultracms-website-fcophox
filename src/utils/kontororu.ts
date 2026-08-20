/**
 * Cliente de Kontorōru — contenido publicado del espacio `fcophox`.
 *
 * Sustituye a las consultas a Supabase de blog y casos de estudio. Portfolio,
 * services y resources siguen en Supabase (src/utils/supabase/*): esto no los
 * toca.
 *
 * La API Key es secreta y sólo puede usarse desde el servidor —Server
 * Components, Route Handlers—. La única excepción es el complemento
 * Reacciones, que no lleva clave y se llama desde el navegador; por eso vive
 * aparte, en `reactionsEndpoint()`.
 */

/* ─────────────────────────── Configuración ─────────────────────────── */

/**
 * Se leen en cada llamada, no al importar el módulo.
 *
 * Capturarlas en una constante de módulo deja la clave vieja en memoria
 * después de editar `.env.local`, y el síntoma —un 401 con una clave que en el
 * archivo ya es correcta— manda a depurar al sitio equivocado.
 */
function baseUrl(): string {
  const url = process.env.KONTORORU_URL;
  if (!url) {
    throw new Error(
      "Falta KONTORORU_URL. Configúrala en .env.local con la base de la " +
      "instalación más /api/v1."
    );
  }
  return url.replace(/\/$/, "");
}

function apiKey(): string {
  const key = process.env.KONTORORU_API_KEY;
  if (!key) {
    throw new Error(
      "Falta KONTORORU_API_KEY. Se obtiene en Kontorōru → Ajustes → API Keys " +
      "y sólo se muestra una vez."
    );
  }
  return key;
}

/**
 * Slugs reales de las categorías del espacio, verificados con GET /categories
 * el 2026-08-20. Se filtra por slug porque es lo que acepta la API; `kind` es
 * lo estable conceptualmente, pero no es un parámetro de filtro.
 */
export const CATEGORIA = {
  blog: "blog",
  casosDeEstudio: "casos-de-estudio",
} as const;

/* ─────────────────────────────── Tipos ─────────────────────────────── */

export type PostKind = "BLOG" | "CASE_STUDY" | "SERVICE" | "CUSTOM";

export interface Media {
  id: string;
  url: string;
  alt: string | null;
  width: number;
  height: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  kind: PostKind;
  description: string | null;
  parentId: string | null;
  postCount: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  seo: { title: string; description: string };
  customFields: Record<string, unknown>;
  /**
   * Nullable a propósito: las categorías son por idioma, así que una
   * traducción cuyo idioma no tiene categoría equivalente llega sin ella.
   * Darlo por hecho reventó /blog con un 500 en otro sitio que usa esta API.
   */
  category: Pick<Category, "id" | "slug" | "name" | "kind"> | null;
  /** Firmada, 24 h de validez. No guardarla: volver a pedirla al revalidar. */
  cover: Media | null;
  tags: Array<{ id: string; slug: string; name: string }>;
  locale?: string;
  translations?: Record<string, string>;
}

export interface PostDetail extends Post {
  content: { html: string; json: unknown };
}

export interface Pagination {
  hasMore: boolean;
  nextCursor: string | null;
}

/** Patrón semanal, no fechas concretas. `weekday` usa el índice de Date#getDay(). */
export interface Availability {
  timezone: string;
  startTime: string;
  endTime: string;
  slotMinutes: number;
  /** Rejilla completa antes de aplicar bloqueos. Sólo para pintar en gris. */
  slots: Array<{ start: string; end: string }>;
  week: Array<{
    weekday: number;
    label: string;
    isClosed: boolean;
    /** Lo que de verdad se ofrece ese día. Es esto lo que hay que usar. */
    available: Array<{ start: string; end: string }>;
  }>;
}

/* ───────────────────────────── Transporte ───────────────────────────── */

export class KontororuError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message);
    this.name = "KontororuError";
  }
}

/**
 * Un 404 se devuelve como `null`, no como excepción: para esta API un borrador
 * y un slug inexistente son indistinguibles por diseño, y ambos deben acabar
 * en notFound(). Los demás errores sí se lanzan — un 401 silenciado como
 * "no hay contenido" vacía el blog sin que nadie se entere.
 */
async function get<T>(path: string, tags: string[]): Promise<T | null> {
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
    next: { tags },
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const detalle = await res.json().catch(() => null);
    throw new KontororuError(
      res.status,
      detalle?.error?.code ?? "unknown",
      detalle?.error?.message ?? `Kontorōru respondió ${res.status} en ${path}`
    );
  }

  return res.json() as Promise<T>;
}

function query(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

/* ─────────────────────────────── Lectura ────────────────────────────── */

export interface ListaOpciones {
  categoria?: string;
  tag?: string;
  /** 1–100. La API usa 20 por defecto. */
  limit?: number;
  /** `pagination.nextCursor` de la respuesta anterior. Es ISO 8601, no un número de página. */
  cursor?: string;
  /**
   * Sin locale se recibe el idioma principal del espacio. Hoy sólo está
   * activado `es`: pedir uno no activado devuelve 400, no una lista vacía.
   */
  locale?: string;
}

export const kontororu = {
  posts: {
    /** El listado NO incluye el cuerpo. Para eso está `bySlug`. */
    async list(opciones: ListaOpciones = {}) {
      const path = `/posts${query({
        category: opciones.categoria,
        tag: opciones.tag,
        limit: opciones.limit,
        cursor: opciones.cursor,
        locale: opciones.locale,
      })}`;

      const tags = ["posts"];
      if (opciones.categoria) tags.push(`posts:${opciones.categoria}`);

      const res = await get<{ data: Post[]; pagination: Pagination }>(path, tags);
      return res ?? { data: [], pagination: { hasMore: false, nextCursor: null } };
    },

    /** `null` si no existe o está en borrador. */
    async bySlug(slug: string, locale?: string) {
      const res = await get<{ data: PostDetail }>(
        `/posts/${encodeURIComponent(slug)}${query({ locale })}`,
        ["posts", `post:${slug}`]
      );
      return res?.data ?? null;
    },
  },

  categories: {
    async list(kind?: PostKind) {
      const res = await get<{ data: Category[] }>(
        `/categories${query({ kind })}`,
        ["categories"]
      );
      return res?.data ?? [];
    },
  },

  /**
   * `null` si el complemento Calendario está desactivado (la API responde 404).
   * En ese caso hay que ocultar la sección de agenda, no dejarla pidiendo.
   *
   * Se cachea con la etiqueta `availability`, que invalida el webhook al
   * recibir `addon.updated`. Sin esa suscripción no se puede cachear más de
   * los 30 s que dice su cabecera: aquí no hay evento de contenido que avise.
   */
  async availability() {
    const res = await get<{ data: Availability }>(
      "/addons/calendar/availability",
      ["availability"]
    );
    return res?.data ?? null;
  },
};

/* ───────────────────────────── Formularios ──────────────────────────── */

export interface EnvioFormulario {
  name?: string;
  email?: string;
  message?: string;
  /** La página de origen. Es lo que distingue un lead de /resources de uno de /contact. */
  sourceUrl?: string;
  /** Todo lo demás del formulario, tal cual. Debe ser serializable a JSON. */
  payload?: Record<string, unknown>;
}

/**
 * Envía a la bandeja del complemento Contactos. Requiere permiso `forms:write`.
 *
 * Desde el SERVIDOR: una clave con este permiso en el bundle la usaría
 * cualquiera para llenar la bandeja de basura.
 *
 * El formulario no hay que declararlo antes — el primer envío da de alta el
 * tipo y la bandeja lo muestra como una pestaña más.
 */
export async function enviarFormulario(formKey: string, envio: EnvioFormulario) {
  if (!/^[a-z][a-z0-9_-]{1,39}$/.test(formKey)) {
    throw new Error(
      `formKey inválido: "${formKey}". Admite minúsculas, números, guion y ` +
      "guion bajo, 2-40 caracteres."
    );
  }

  // Al menos uno de los tres: una fila sin nada que mostrar es ruido en la bandeja.
  if (!envio.name && !envio.email && !envio.message) {
    throw new Error("El envío necesita al menos nombre, correo o mensaje.");
  }

  const res = await fetch(
    `${baseUrl()}/forms/${formKey}/submissions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envio),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const detalle = await res.json().catch(() => null);
    throw new KontororuError(
      res.status,
      detalle?.error?.code ?? "unknown",
      // Un 404 aquí significa complemento apagado, no ruta inexistente.
      detalle?.error?.message ?? `Kontorōru respondió ${res.status} al enviar "${formKey}"`
    );
  }

  return (await res.json()) as {
    data: { id: string; formKey: string; createdAt: string };
  };
}

/* ────────────────────────────── Reacciones ──────────────────────────── */

/**
 * Datos para que el NAVEGADOR llame al endpoint de reacciones.
 *
 * Es el único endpoint sin clave, así que el espacio viaja en la petición
 * (`tenant`, el slug público, que no es un secreto).
 *
 * El POST debe salir del navegador de cada lector: el cupo es de 60/min por
 * IP y no por clave —no hay clave—, así que proxiándolo por el servidor toda
 * la web comparte una IP y agota el cupo entre todos. El GET sí puede ir por
 * servidor.
 */
export function reactionsEndpoint() {
  const url = process.env.NEXT_PUBLIC_KONTORORU_URL;
  const tenant = process.env.NEXT_PUBLIC_KONTORORU_TENANT;
  if (!url || !tenant) {
    throw new Error(
      "Faltan NEXT_PUBLIC_KONTORORU_URL o NEXT_PUBLIC_KONTORORU_TENANT."
    );
  }
  return { url: `${url.replace(/\/$/, "")}/reactions`, tenant };
}

/**
 * Contadores de un contenido, para pintarlos en servidor.
 *
 * Un contenido sin reacciones devuelve `{}` con un 200, igual que un slug
 * inexistente: no sirve para saber si un artículo existe.
 */
export async function leerReacciones(slug: string): Promise<Record<string, number>> {
  const { url, tenant } = reactionsEndpoint();
  const res = await fetch(
    `${url}?tenant=${encodeURIComponent(tenant)}&slug=${encodeURIComponent(slug)}`,
    { next: { tags: [`reactions:${slug}`], revalidate: 60 } }
  );
  if (!res.ok) return {};
  const json = await res.json().catch(() => null);
  return json?.data?.totals ?? {};
}
