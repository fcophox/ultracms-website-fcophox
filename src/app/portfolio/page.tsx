import { kontororu, CATEGORIA } from "@/utils/kontororu";
import { aListadoArray } from "@/utils/kontororu-adapter";
import { PortfolioClient } from "./portfolio-client";

/*
 * Server Component sólo para resolver el contenido de Kontorōru: su API Key es
 * secreta y `portfolio-client.tsx` se envía al navegador.
 *
 * La configuración del portafolio y los proyectos siguen leyéndose desde el
 * cliente contra Supabase con la anon key, que sí puede ir en el bundle.
 */
export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

export default async function PortfolioPage() {
  const [articulos, casos] = await Promise.all([
    kontororu.posts.list({ categoria: CATEGORIA.blog, limit: 3 }),
    kontororu.posts.list({ categoria: CATEGORIA.casosDeEstudio, limit: 3 }),
  ]);

  return (
    <PortfolioClient
      recentArticles={aListadoArray(articulos.data)}
      recentCases={aListadoArray(casos.data)}
    />
  );
}
