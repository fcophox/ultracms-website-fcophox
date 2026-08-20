/**
 * Origen público del sitio.
 *
 * Lleva `www`: es el host que sirve producción, y el ápex responde una
 * redirección hacia él. Emitir el ápex en el sitemap o en robots.txt manda a
 * los buscadores a la versión no canónica y desperdicia presupuesto de rastreo
 * en un salto.
 *
 * Se puede sobreescribir con `NEXT_PUBLIC_BASE_URL` para previews.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.fcophox.com"
).replace(/\/$/, "");
