# Migración del CMS interno a Kontorōru

Manual paso a paso para sacar el CMS interno (Supabase + `/dashboard`) de
`fcophox-website` y conectar el sitio público a un espacio de Kontorōru.

- **Espacio destino:** cuenta propietario `alice@fcophox.com`
- **Contenido:** 18 posts publicados — 10 en `blog`, 8 en `casos-de-estudio`, solo `es`.
  Los 3 que faltaban respecto a Supabase eran borradores y se descartaron.
- **Precedente:** `~/code/rukma-studio/KONTORORU_MIGRATION.md` (blog + webhook). Se
  reutiliza el mismo patrón de cliente y revalidación.

---

## 0. Alcance acordado

### Entra en la migración

| Qué | Origen actual | Destino en Kontorōru |
|---|---|---|
| Artículos del blog | tabla `articles` | `GET /posts?category=blog` |
| Casos de estudio | tabla `case_studies` | `GET /posts?category=casos-de-estudio` |
| Formularios de contacto | tabla `contact_messages` vía `/api/contact` | `POST /forms/{formKey}/submissions` (complemento **Contactos**) |
| Captación de leads | inserciones a `contact_messages` desde `resources-hero` y `prompt-library` | mismo endpoint, con `formKey` distinto |
| Disponibilidad del calendario | tabla `availability_settings` | `GET /addons/calendar/availability` (complemento **Calendario**) |
| Likes de artículos | columna `likes` + `/api/likes` | complemento **Reacciones** |

### No entra: Supabase sigue vivo

`portfolio` y `portfolio_config` **se quedan en Supabase** con su parte del
dashboard. Consecuencia directa, y es deliberada:

> **`/login`, `src/middleware.ts` y `src/utils/supabase/*` NO se borran.**
> El borrado es parcial. Se elimina solo la parte de artículos, casos de estudio
> y calendario del dashboard.

### i18n

Solo se cargó el español en Kontorōru. Por tanto:

- `src/utils/locale-mapper.ts` **se mantiene** para portfolio/services (que siguen
  en Supabase con columnas `_en`).
- Blog y casos de estudio se sirven en `es` en ambos locales hasta que se carguen
  las traducciones. Queda como fase posterior (§9).

---

## 1. Preparar el espacio en Kontorōru

Todo esto se hace en el panel, antes de tocar código.

1. Entra como `alice@fcophox.com`.
2. **Ajustes → Idiomas** — confirma que `es` es el idioma principal.
3. **Complementos** — activa los tres que necesitamos:
   - **Calendario** (`calendar`)
   - **Contactos** (`contacts`)
   - **Reacciones** (`reactions`)

   Si alguno queda apagado, su endpoint responde `404`, no una lista vacía.
4. **Ajustes → API Keys → Nueva clave**
   - Nombre: `fcophox-website`
   - Permisos: **Leer contenido** (`content:read`), **Leer medios** (`media:read`)
     y **Escribir formularios** (`forms:write`).
   - **Cópiala ahora.** Se muestra una sola vez; solo se guarda un hash.
5. **Ajustes → Webhooks → Nuevo webhook**
   - URL producción: `https://<dominio>/api/revalidate/kontororu`
   - Eventos: `post.published`, `post.updated`, `post.deleted`, `addon.updated`
   - Copia el **secreto**.
6. **Complementos → Calendario** — traslada a mano la configuración que hoy vive en
   `availability_settings`. Ojo con el cambio de modelo (§5).
7. Anota el **slug público del espacio** (`tenant`). Lo necesita el complemento
   Reacciones, que se llama desde el navegador y no lleva clave.

### Variables de entorno

En `.env.local` y en Vercel (Production + Preview):

```bash
KONTORORU_URL=https://<instalacion>.kontororu.app/api/v1
KONTORORU_API_KEY=kntr_live_xxxxxxxxxxxx.yyyyyyyyyyyyyy
KONTORORU_WEBHOOK_SECRET=<secreto del webhook>
NEXT_PUBLIC_KONTORORU_TENANT=<slug-del-espacio>
NEXT_PUBLIC_KONTORORU_URL=https://<instalacion>.kontororu.app/api/v1
```

`KONTORORU_API_KEY` es **secreta**: solo en servidor. `NEXT_PUBLIC_*` existen
únicamente porque `/reactions` se llama desde el navegador y no lleva clave.

Las de Supabase (`NEXT_PUBLIC_SUPABASE_*`, `RESEND_API_KEY`, `CONTACT_EMAIL`) se
quedan.

---

## 2. Respaldos previos (irreversible si se salta)

```bash
# Conteos de likes: Reacciones no admite sembrar valores iniciales,
# así que se pierden salvo que los guardemos aquí.
node scripts/export-likes.mjs > MIGRACION_LIKES.md
```

El script (a crear) lee `articles` y `case_studies` y vuelca
`slug | title | likes` en una tabla Markdown. También conviene exportar
`contact_messages` y `availability_settings` a JSON antes de dejar de escribir
en ellos.

---

## 3. Cliente de la API

**Creado: `src/utils/kontororu.ts`.** En `src/utils/`, no `src/lib/`: es la
convención de este repo (`src/utils/supabase/`, `src/utils/locale-mapper.ts`).

Slugs de categoría **verificados** contra `GET /categories` el 2026-08-20:
`blog` (kind `BLOG`) y `casos-de-estudio` (kind `CASE_STUDY`). Están en la
constante `CATEGORIA`.

```ts
const BASE = process.env.KONTORORU_URL!;
const KEY = process.env.KONTORORU_API_KEY!;

async function get<T>(path: string, tags: string[]): Promise<T | null> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${KEY}` },
    next: { tags },
  });
  if (res.status === 404) return null;      // borrador o slug inexistente
  if (!res.ok) throw new Error(`Kontorōru ${res.status}: ${path}`);
  return res.json();
}

export const kontororu = {
  posts: {
    list: (params = "") => get<{ data: Post[] }>(`/posts${params}`, ["posts"]),
    bySlug: (slug: string) =>
      get<{ data: PostDetail }>(`/posts/${slug}`, ["posts", `post:${slug}`]),
  },
  categories: { list: () => get<{ data: Category[] }>("/categories", ["categories"]) },
  availability: () =>
    get<{ data: Availability }>("/addons/calendar/availability", ["availability"]),
};
```

Tipos (`Post`, `PostDetail`, `Category`, `Availability`) según `docs/API.md` del
CMS. Un `404` se devuelve como `null` a propósito: un borrador y un slug
inexistente son indistinguibles por diseño, y ambos deben acabar en `notFound()`.

### Mapeo de campos

| Campo hoy (Supabase) | Campo en Kontorōru |
|---|---|
| `title` | `title` |
| `slug` | `slug` |
| `content` (HTML de Tiptap) | `content.html` |
| `image_url` | `cover.url` (+ `cover.width`/`height`/`alt`) |
| `published_at` | `publishedAt` |
| `category` | `category.name` / `category.slug` — **nullable**: las categorías son por idioma y una traducción sin equivalente llega sin ella |
| `status = 'published'` | implícito: la API solo sirve publicado |
| `likes` | complemento Reacciones |
| — | `excerpt`, `readingTime`, `seo`, `tags`, `customFields` (nuevos, aprovechables) |

**`cover.url` está firmada y caduca a las 24 h.** No se guarda en base ni se
hardcodea: se vuelve a pedir en cada revalidación. Las imágenes dentro de
`content.html` se refirman en cada petición del detalle, así que no caducan
mientras se lea el detalle en cada build.

### `next.config.ts`

Añadir el host de medios de Kontorōru a `images.remotePatterns`. El de Supabase
(`kmpspmzaelzdrkasvhrg.supabase.co`) se mantiene mientras portfolio siga ahí.

El host de medios del CMS es **`glepekbxevoowijfzywe.supabase.co`** (verificado
vía `GET /media`). Es un proyecto Supabase distinto del nuestro: van **los dos**
hosts en `remotePatterns`, no se sustituye uno por otro.

---

## 4. Migrar blog y casos de estudio (hecho)

Archivos a modificar:

| Archivo | Cambio |
|---|---|
| `src/app/blog/page.tsx` | `supabase.from("articles")` → `kontororu.posts.list("?category=blog")` |
| `src/app/blog/[slug]/page.tsx` | `.or(slug/slug_en)` → `kontororu.posts.bySlug(slug)`; el `generateMetadata` usa `post.seo` y `post.excerpt` en vez de recortar el HTML a 160 caracteres |
| `src/app/case-studies/page.tsx` | ídem con `?category=casos-de-estudio` |
| `src/app/case-studies/[slug]/page.tsx` | ídem |
| `src/components/blog.tsx` | lee `articles`; pasa a recibir los posts por props desde un Server Component |
| `src/components/related-articles-carousel.tsx` | alimentar desde `posts.list` (se puede filtrar por `tag`) |
| `src/app/portfolio/page.tsx` | **es `"use client"`** y consulta `articles` y `case_studies` desde el navegador. La clave de Kontorōru no puede ir al bundle: hay que subir el fetch a un Server Component padre y pasar los datos por props. |

**Adaptador:** `src/utils/kontororu-adapter.ts` traduce el `Post` de la API a la
forma que ya esperan `blog-client.tsx` y `case-studies-client.tsx`. Se adaptó en
vez de reescribir esos componentes: su contrato no tenía nada de malo, sólo
cambió de dónde salen los datos.

**Regresión de taxonomía.** En Supabase `category` era un valor POR ENTRADA
("Academy", "UX", "App"…) y es lo que alimenta los chips de filtro. En Kontorōru
`category` es el TIPO de contenido, igual para toda la sección: el filtro se
queda en un botón. El adaptador usa `post.tags[0]` para el chip y cae al nombre
de la categoría si no hay etiquetas. **La taxonomía anterior está en
`MIGRACION_TAXONOMIA.md`** para reintroducirla como etiquetas en el panel; los
chips reaparecen solos en cuanto existan.

Los casos de estudio además tenían `tags` con valores reales ("Product Designer",
"UX Strategy"…) que tampoco se importaron.

Puntos de atención:

- `revalidate = 60` puede subir a `revalidate = 3600` o `force-static` una vez el
  webhook esté verificado: la invalidación deja de depender del reloj.
- `mapToLocale`/`mapArrayToLocale` **se retiran de blog y casos de estudio** (ya no
  hay columnas `_en` ahí), pero siguen en portfolio/services.
- El HTML de `content.html` llega saneado en servidor con allowlist, así que sigue
  siendo válido inyectarlo con `dangerouslySetInnerHTML` en `.tiptap-content`.
  Los estilos de `src/app/tiptap-content.css` no se tocan.
- Verificar que el marcado que produce Kontorōru coincide con lo que espera
  `src/app/tiptap-content.css` (figuras, captions, imágenes al 110%). Si no, es
  ajuste de CSS en ese archivo, **nunca en `globals.css`** (se regenera).
- `scripts/check-article-styles.mjs` corre en `prebuild`: verificado, pasa.

**Verificado en navegador** contra el HTML real de Kontorōru:

- Estructura `<img><p>caption</p>`, así que el selector `.tiptap-content img + p`
  sigue produciendo el caption centrado a 0.875em.
- La regla del 110% aplica: a 1280px de viewport, contenido 760px e imagen 836px
  (`ratio 1.1`).
- `/`, `/blog`, `/case-studies`, `/portfolio` y los detalles responden 200; un
  slug inexistente responde 404.
- `npm run build` compila sin errores.

`revalidate` subió de 60 (y de 0 en la home) a 3600: la invalidación pasa a
depender del webhook, no del reloj. Queda como red de seguridad por si se pierde
una entrega.

---

## 4-bis. Redirecciones de slugs (hecho)

La importación cambió 12 URLs que hoy están indexadas. Sin redirección quedan
en 404.

**Los slugs no se pueden devolver a su forma original.** `slugify` del CMS
recorta a 80 caracteres (`src/lib/content/slug.ts:14`) y ese mismo recorte se
aplica en el campo de slug del editor, así que tampoco se arregla a mano en el
panel. Cinco entradas apuntan a un slug cortado a media palabra.

Causas del cambio, por orden de frecuencia:

1. **Truncado a 80 caracteres** (5 casos) — `...that-the-machine-will-read` quedó
   en `...that-the-machine-will`.
2. **Adopción del `slug_en`** (5 casos) — `a-community-of-cyclists-...` quedó como
   `community-of-cyclists-...`.
3. **Normalización de mayúsculas** (2 casos) — `RAG-Platform-...` → `rag-platform-...`.

Las URLs en inglés entran en el mapa porque **hoy responden en producción**: la
consulta anterior hacía `.or(slug.eq.X,slug_en.eq.X)`, así que ambas formas
están indexadas.

- Mapa: `src/data/slug-redirects.ts` (generado, no editar a mano)
- Conexión: `redirects()` en `next.config.ts`

Van en `next.config.ts` y no en `src/middleware.ts` a propósito: se resuelven
antes de que el middleware corra, así que una redirección no arrastra la
comprobación de sesión de Supabase.

Verificado: **12/12 devuelven 308 al destino correcto.**

---

## 4-ter. Las imágenes del contenido siguen en Supabase

La importación **no subió a la biblioteca de Kontorōru las imágenes incrustadas
en el cuerpo** de los artículos. Quedaron como URLs externas al bucket propio:

```html
<img class="kntr-image" src="https://kmpspmzaelzdrkasvhrg.supabase.co/storage/v1/object/public/article-images/….png">
```

Son públicas, no firmadas, así que funcionan — pero **atan el sitio al bucket
`article-images` de forma permanente**. Sólo las 20 portadas están en la
biblioteca del CMS.

Consecuencia para §9: ese bucket **no se puede borrar** mientras no se resuban
esas imágenes y se reescriba el HTML.

La clase `kntr-image` no afecta al estilo: `src/app/tiptap-content.css` usa el
selector de elemento `.tiptap-content img`, así que la regla del 110% sigue
aplicando.

---

## 5. Migrar la disponibilidad del calendario (hecho)

**Es el cambio con más trampa: el modelo de datos se invierte.**

| Hoy | Kontorōru |
|---|---|
| Rejilla fija de 10 tramos de 15 min hardcodeada en el componente (`"18:30 - 18:45 hrs"`) | `slotMinutes` + `slots` calculados por el CMS |
| `restricted_days: number[]` — lista de **bloqueos** | `week[].isClosed` |
| `daily_slot_restrictions: {dia: string[]}` — lista de **bloqueos** | `week[].available` — lista de **lo que sí se ofrece** |
| Zona horaria implícita del navegador | `timezone` explícita (`America/Santiago`) |
| Strings `"18:30 - 18:45 hrs"` | objetos `{ start: "18:30", end: "18:45" }` |

Pasos:

1. En `src/components/contact-forms.tsx`, borrar el array `allSlots` hardcodeado y
   la lógica de `getSlotsForSelected()` que resta bloqueos. Ahora se **pinta lo que
   viene en `available`**, no lo que sobra tras restar.
2. `weekday` de Kontorōru usa el mismo índice que `Date#getDay()` (0 = domingo), que
   es el que ya usa `generateDays()`. Ese cálculo se conserva.
3. El componente es `"use client"` y hoy consulta Supabase con la anon key. La clave
   de Kontorōru no puede ir al navegador → **crear `src/app/api/availability/route.ts`**
   que llame a `kontororu.availability()` desde el servidor y devuelva el JSON, o
   subir el fetch al Server Component padre.
4. Formatear los tramos para la UI (`"18:30 - 18:45 hrs"`) en el cliente a partir de
   `start`/`end`, respetando `timezone`.
5. **Caché:** `Cache-Control: s-maxage=30, must-revalidate` y **no hay webhook de
   contenido que avise**. Al estar suscritos a `addon.updated` (§1.5) se puede
   cachear con la etiqueta `availability` e invalidarla desde el webhook. Sin esa
   suscripción, no fijar un `revalidate` propio mayor a 30 s.
6. Si el complemento se desactiva (`isEnabled: false` en el webhook), el endpoint
   devuelve `404`: la UI debe ocultar la sección de agenda, no quedarse pidiendo.

Luego, borrar `src/app/dashboard/calendar/page.tsx`.

### Lo que se hizo

- `src/app/api/availability/route.ts` — puente servidor↔cliente, porque el
  formulario es `"use client"` y la API Key es secreta. Devuelve
  `{ data: null, reason: "addon_disabled" }` con 200 cuando el complemento está
  apagado, para distinguirlo de un error.
- `src/components/contact-forms.tsx` — `MeetingForm` reescrito:
  - Fuera el array `allSlots` de 10 tramos escritos a mano; ahora sale de
    `availability.slots`.
  - Fuera `restrictedDays` y `dailyRestrictions`; los días vienen de
    `week[].isClosed` y los tramos de `week[].available`.
  - Con el complemento apagado la sección se retira con un mensaje, en vez de
    mostrar un calendario que no deja avanzar.
  - La zona horaria se muestra al usuario: antes era la del navegador y no se
    decía en ninguna parte.
  - La duración del tramo sale de `slotMinutes`. Estaba escrita a mano en las
    traducciones (`"Horario de reunión (15 mins)"`) y ya no coincidía.

### ⚠️ La configuración del panel NO es la que tenía el sitio

El complemento está con sus valores por defecto —09:00–18:00, tramos de 30 min,
los siete días abiertos—, que no es lo que servía Supabase. Traducción de lo que
había (`availability_settings`, actualizado el 2026-05-27):

| Ajuste del panel | Valor a poner |
|---|---|
| Horario | **18:30 – 21:00** |
| Duración del tramo | **15 min** |
| Días cerrados | **viernes, sábado y domingo** |

Y los bloqueos por día, que en el panel se marcan sobre la rejilla:

| Día | Tramos a bloquear |
|---|---|
| Lunes | 18:30–18:45, 18:45–19:00 |
| Martes | 20:00–20:15, 20:15–20:30, 20:30–20:45, 20:45–21:00 |
| Miércoles | 18:30–18:45, 20:30–20:45, 20:45–21:00 |
| Jueves | 18:30–18:45, 18:45–19:00 |

Mientras no se traslade, la web ofrece el horario por defecto del complemento.

---

## 6. Migrar formularios y captación de leads (hecho)

Tres sitios escriben hoy en `contact_messages`:

| Archivo | `formKey` propuesto |
|---|---|
| `src/app/api/contact/route.ts` (contacto / reunión / consultoría) | `contacto`, `agenda`, `consultoria` según `messageType` |
| `src/app/resources/resources-hero.tsx:103` | `recursos` |
| `src/app/resources/prompt-library.tsx:51` | `biblioteca-prompts` |

Reglas del endpoint:

- `POST {BASE}/forms/{formKey}/submissions`, `Authorization: Bearer <key>`,
  permiso `forms:write`. **Desde el servidor**, nunca desde el navegador.
- `formKey` debe cumplir `^[a-z][a-z0-9_-]{1,39}$`.
- **No hay que declarar el formulario antes**: el primer envío lo da de alta y
  aparece como pestaña en la bandeja.
- Cuerpo: `{ name?, email?, message?, sourceUrl?, payload?: {} }`. Al menos uno de
  `name`/`email`/`message` es obligatorio. Todo lo demás va en `payload`.
- Respuesta `201` con `{ data: { id, formKey, createdAt } }`.
- Si el complemento Contactos está apagado, responde `404`.

Cambios:

1. Los dos componentes de `resources/` son `"use client"` y hoy insertan directo a
   Supabase. Deben pasar a hacer `POST /api/contact` (o una ruta hermana) y que el
   servidor hable con Kontorōru.
2. En `src/app/api/contact/route.ts`, sustituir el bloque `supabase.from("contact_messages").insert(...)`
   por la llamada a Kontorōru. **El envío por Resend se mantiene tal cual.**
3. Los datos extra de la agenda (fecha y tramo elegidos) van en `payload`:
   ```ts
   payload: { fecha: "2026-09-03", tramo: "18:30 - 18:45", messageType }
   ```
4. Añadir `sourceUrl` con la página de origen: es lo que distingue un lead de
   `/resources` de uno de `/contact` en la bandeja.
5. Mantener el manejo de error actual: si Kontorōru falla, la respuesta debe seguir
   diciéndolo con `500` y el mensaje no debe darse por enviado.

### Lo que se hizo

- `src/app/api/contact/route.ts` — el insert a `contact_messages` se sustituyó por
  `enviarFormulario()`. **Resend se mantiene intacto.** Un fallo de correo no
  invalida el envío: ya está en la bandeja. Un 404 de Kontorōru se registra como
  "complemento Contactos apagado", porque la solución está en el panel y no en el
  código.
- `src/app/api/track/route.ts` — ruta nueva para los dos registros de `/resources`,
  que antes escribían en Supabase desde el navegador.
- `resources-hero.tsx` y `prompt-library.tsx` — ya no importan el cliente de
  Supabase; llaman a `/api/track`.
- La agenda manda `fecha` y `tramo` en `payload`, además del texto: en la bandeja
  se leen como campos propios sin parsear el mensaje.

`formKey` por tipo, cada uno una pestaña en la bandeja:

| Origen | `formKey` |
|---|---|
| Formulario de mensaje | `contacto` |
| Agenda de reunión | `agenda` |
| Consultoría UX | `consultoria` |
| Desbloqueo de recursos | `recursos` |
| Copia de prompt | `biblioteca-prompts` |

**Los dos últimos no son leads.** Llevan correos de relleno
(`unlock@fcophox.com`, `copy@fcophox.com`) y GA4 ya los registra con
`sendGAEvent`. Se migraron para dejar de escribir en Supabase, no porque la
bandeja sea su sitio. Valorar si conviene retirarlos y quedarse sólo con GA4.

---

## 7. Migrar los likes a Reacciones

1. Ejecutar el respaldo de §2 **antes** de tocar nada.
2. `src/components/article-feedback.tsx` recibe hoy `{ itemId, tableName }` y llama a
   `/api/likes`. Pasa a recibir `{ slug }` y llamar directo desde el navegador:
   ```ts
   POST {NEXT_PUBLIC_KONTORORU_URL}/reactions
   { tenant: NEXT_PUBLIC_KONTORORU_TENANT, slug, reaction: "like" }
   ```
   Devuelve el total ya incrementado; no hace falta un segundo `GET`.
3. **El `POST` tiene que salir del navegador de cada lector.** El cupo es 60/min
   **por IP**: si se proxya por el servidor, todo el sitio comparte una IP y se agota
   entre todos.
4. El `GET` de contadores sí puede ir por servidor, al pintar la página.
5. El guard de `localStorage` (`liked_${tableName}_${itemId}`) sigue siendo necesario:
   la API no permite retirar una reacción, el contador solo sube.
6. Borrar `src/app/api/likes/route.ts`.
7. Un contenido sin reacciones devuelve `{}` con `200`, igual que un slug
   inexistente: no usar este endpoint para comprobar si un artículo existe.

---

## 8. Webhook de revalidación (hecho)

**Crear `src/app/api/revalidate/kontororu/route.ts`.** Patrón exacto de
`docs/API.md` §Webhooks:

1. Leer el cuerpo como texto (`req.text()`), no como JSON: el HMAC se calcula sobre
   el cuerpo crudo.
2. Rechazar si `x-kontororu-timestamp` se aparta más de 300 s (anti-reenvío).
3. Comparar `x-kontororu-signature` con
   `sha256=hmac(secreto, "${ts}.${body}")` usando `timingSafeEqual`.
4. Según `event`:
   - `post.published` / `post.updated` / `post.deleted` →
     `revalidateTag("posts")` + `revalidateTag("post:" + data.slug)`.
   - **Si viene `previousSlug`, invalidar también `post:${previousSlug}`.** Sin eso,
     la página con el slug viejo queda publicada para siempre.
   - `addon.updated` → `revalidateTag("availability")`. El payload **no trae la
     configuración**: es un aviso de "vuelve a pedirlo".
5. **El endpoint debe ser idempotente**: un reintento tras timeout puede entregar el
   mismo evento dos veces. Revalidar dos veces no cuesta nada; enviar un email desde
   aquí, sí. No mandar correo desde el webhook.
6. La papelera emite `post.deleted`, no `post.updated`: es una baja y la página se
   retira.

Los fallos se reintentan solos a 1, 2, 4, 8, 16 y 32 minutos, y hay reintento manual
en el panel.

### Lo que se hizo

`src/app/api/revalidate/kontororu/route.ts`.

**`revalidateTag` cambió de firma en esta versión de Next.** Ahora pide un perfil
como segundo argumento (`revalidateTag(tag, "max")`); la forma de un solo
argumento está deprecada y da error de tipos. `updateTag`, que expira en el acto,
**no sirve aquí**: sólo puede llamarse desde Server Actions, no desde un Route
Handler.

Consecuencia de `"max"` (stale-while-revalidate): tras un `post.deleted`, la
primera visita todavía recibe la versión cacheada y la siguiente ya no. Para un
blog es aceptable, y `revalidate = 3600` en las páginas es la red de seguridad.

Etiquetas que invalida cada evento:

| Evento | Etiquetas |
|---|---|
| `post.published` / `post.updated` / `post.deleted` | `posts`, `posts:blog`, `posts:casos-de-estudio`, `post:{slug}` y `post:{previousSlug}` si viene |
| `addon.updated` con `addon: "calendar"` | `availability` |
| `addon.updated` de otro complemento | ninguna |
| Cualquier otro | ninguna, responde 200 con `{ignored}` — no es un fallo y no debe reintentarse |

Se invalidan **los dos listados** en cada cambio de contenido porque el payload no
dice de qué categoría era la entrada.

**Verificado con firmas reales**, 10 casos:

| Caso | Resultado |
|---|---|
| `post.published` con firma válida | 200, invalida 4 etiquetas |
| `post.updated` con `previousSlug` | 200, invalida las dos URLs |
| `post.deleted` | 200 |
| `addon.updated` de calendar / de otro | 200 con y sin `availability` |
| Evento desconocido | 200 `{ignored}` |
| Firma incorrecta | 401 |
| Sin cabeceras de firma | 401 |
| Timestamp de hace 10 min | 401 |
| Cuerpo alterado tras firmar | 401 |

⚠️ **La URL del webhook debe responder 200 directo, sin redirección.** Un ápex que
hace 307 hacia `www` pierde la entrega en el salto y el panel la registra como
fallida. Sólo se aceptan direcciones públicas por HTTPS, así que en local no se
puede recibir una entrega real: hay que usar un túnel o firmar a mano.

---

## 9. Borrado (mismo PR, parcial) (hecho)

**Se borra:**

```
src/app/dashboard/articles/          (page, new, edit/[id])
src/app/dashboard/case-studies/      (page, new, edit/[id])
src/app/dashboard/calendar/page.tsx
src/app/api/likes/route.ts
```

7 archivos borrados. Rutas de `/dashboard` que quedan: `clients`, `portfolio`,
`portfolio/edit/[id]`, `portfolio/new`, `resources`, `services`,
`services/edit/[id]`, `services/new`.

`src/app/dashboard/layout.tsx` — fuera las entradas de nav de Artículos, Casos de
Estudio y Calendario, sus contadores y los iconos que quedaron sin uso.

`src/app/dashboard/page.tsx` — **reescrito**. Su único contenido era el ranking de
contenido por la columna `likes` de `articles` y `case_studies`. Esas tablas ya no
reciben escrituras, así que ese ranking habría quedado congelado el día de la
migración — peor que no mostrarlo, porque parece actual. Ahora hay dos tarjetas:
una que enlaza al panel de Kontorōru y otra que explica dónde viven las
reacciones.

### `clients` y `resources` — también borrados

Los dos leían `contact_messages`, que se migró en el §6, así que habrían quedado
mostrando datos congelados para siempre:

- `dashboard/clients` era la bandeja de entrada → ahora **Complementos → Contactos**.
- `dashboard/resources` graficaba los desbloqueos → ahora el formulario `recursos`.

### `services` — borrado también

`dashboard/services` administraba una tabla **vacía**: `select * from services`
devuelve 0 filas. Los cuatro servicios reales viven en `src/data/services-data.ts`,
en el repo. El dashboard no gestionaba nada.

Al quedarse sin entradas, la sección "Workspaces" del nav desaparece entera, con
su estado de contadores y el helper `getCount`. Sólo queda **Complementos →
Portfolio**.

> Nota: `src/app/capabilities/[slug]/page.tsx` todavía consulta `services` como
> respaldo cuando el slug no es uno de los cuatro del archivo. Con la tabla vacía
> ese camino siempre acaba en 404, que es justo lo que corresponde para un slug
> desconocido, así que es inofensivo — pero es código muerto.

Con esto `/dashboard` queda reducido a **Portafolio**, lo único que Kontorōru
todavía no cubre.

> Plan del propietario: cuando exista el complemento de **Portafolio** en
> Kontorōru, ese contenido se cargará a mano por ahí y el dashboard interno
> —junto con `/login`, `src/middleware.ts` y `src/utils/supabase/*`— podrá
> retirarse por completo. Los servicios, si vuelven a hacer falta, se harán como
> contenido del nuevo CMS.

**NO se borra** (portfolio, services, portfolio_config y resources siguen en Supabase):

```
src/app/login/                       src/middleware.ts
src/utils/supabase/*                 src/utils/locale-mapper.ts
src/app/dashboard/portfolio/         src/app/dashboard/services/
src/app/dashboard/resources/         src/app/dashboard/clients/
src/components/rich-text-editor.tsx  (lo usan portfolio y services)
```

`@supabase/*` y las dependencias de Tiptap **se quedan en `package.json`**.

**En Supabase**, tras verificar en producción: `articles`, `case_studies`,
`contact_messages` y `availability_settings` pasan a solo lectura (revocar `INSERT`/
`UPDATE` en RLS) durante un ciclo antes de borrarlas. **El bucket `article-images` NO se puede borrar**: las imágenes del cuerpo de
los artículos siguen sirviéndose desde ahí (§4-ter).

---

## 10. Fases posteriores

- **Traducciones al inglés.** Cargar cada artículo como contenido hermano en `en`.
  Después: `?locale=` en las llamadas, `post.translations` para el selector de idioma
  y los `hreflang`, y `mapToLocale` fuera de blog/casos. Pedir un locale no activado
  devuelve `400`, no lista vacía.
- **Portafolio y Recursos a Kontorōru** cuando existan sus complementos: el
  propietario los cargará a mano desde el panel. Ahí se puede apagar Supabase y
  borrar `/login`, `src/middleware.ts`, `src/utils/supabase/*` y lo que queda de
  `/dashboard`.
- **Recuperar los conteos de likes** desde `MIGRACION_LIKES.md` si se decide
  reflejarlos.

---

## 11. Verificación

Antes de mergear:

```bash
npm run dev
```

- [ ] `/blog` lista los artículos de Kontorōru, ordenados por `publishedAt` desc
- [ ] `/blog/<slug>` renderiza `content.html` con los estilos de `.tiptap-content`
- [ ] `/case-studies` y su detalle, ídem
- [ ] Portadas cargan (host añadido a `remotePatterns`)
- [ ] Un slug inexistente da `404`, no un error de servidor
- [ ] Un borrador de Kontorōru da `404`
- [ ] `/contact` muestra solo los tramos de `week[].available`
- [ ] Enviar los tres formularios → aparecen en **Complementos → Contactos**, en su
      pestaña, con `sourceUrl` y `payload` correctos
- [ ] Sigue llegando el correo de Resend
- [ ] Pulsar "me gusta" incrementa en **Complementos → Reacciones**
- [ ] `/portfolio`, `/resources`, `/dashboard/services` siguen funcionando (Supabase)
- [ ] `npm run build` pasa, incluido el `prebuild` de `check-article-styles.mjs`
- [ ] `npm run lint` limpio

Tras el deploy:

- [ ] Publicar un post en Kontorōru → la web se actualiza en segundos sin rebuild
- [ ] Cambiar un slug → la URL vieja deja de responder
- [ ] Mover a papelera → la página se retira
- [ ] Cambiar la disponibilidad → `/contact` refleja el cambio
- [ ] **Ajustes → Webhooks** muestra las entregas en verde

---

## 12. Problemas conocidos

**`401 unauthorized`** — clave ausente, mal copiada o revocada. Genera otra en
Ajustes → API Keys.

**`403 forbidden`** — la clave existe pero le falta el permiso. Los formularios
necesitan `forms:write`, la biblioteca `media:read`, aparte de `content:read`.

**`404` en `/addons/calendar/availability` o al enviar un formulario** — el
complemento está apagado en el espacio, no es un fallo de código.

**Las portadas dejan de cargar a las 24 h** — se cachearon URLs firmadas. Hay que
volver a pedir el detalle en cada revalidación, o guardar `content.json` y resolver
por `mediaId` con `/media/{id}`.

**El webhook no dispara** — revisar el secreto y el registro de entregas en el panel.
Solo se aceptan URLs públicas por HTTPS: en local hay que usar un túnel o probar la
firma con un `curl` manual.

**`429 rate_limited`** — 60/min en plan Free por clave. Llegar ahí casi siempre
significa un bucle en el código, no tráfico real.
