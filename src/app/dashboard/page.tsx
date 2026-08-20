import { createClient } from "@/utils/supabase/server";
import { ArrowUpRight, Heart, FileText } from "lucide-react";

export const revalidate = 0; // Disable caching for the admin dashboard so it's always real-time

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Francisco";
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

  /*
   * Antes esta página listaba el contenido más gustado leyendo la columna
   * `likes` de `articles` y `case_studies`.
   *
   * Esas tablas ya no reciben escrituras: el contenido vive en Kontorōru y las
   * reacciones en su complemento, contadas por slug. Seguir mostrando aquella
   * columna daría un ranking congelado el día de la migración, que es peor que
   * no mostrar nada porque parece actual.
   */
  const panelKontororu = process.env.KONTORORU_URL?.replace(/\/api\/v1\/?$/, "") ?? null;

  return (
    <div className="px-12 pb-24 pt-12">
      {/* Greeting Header */}
      <div className="mb-12">
        <span className="text-[14.5px] font-medium text-muted/70 block mb-1">
          Hola, <span className="text-foreground/90 font-semibold">{capitalizedUserName}</span>, te damos la bienvenida
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-border/40 rounded-2xl bg-surface p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-muted/10 border border-border/30 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-muted" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Artículos y casos de estudio</h2>
          <p className="text-[14px] text-muted leading-relaxed mb-4">
            Se editan y publican en Kontorōru. La web se actualiza sola al publicar,
            sin necesidad de desplegar.
          </p>
          {panelKontororu && (
            <a
              href={panelKontororu}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-foreground hover:underline"
            >
              Abrir Kontorōru
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </section>

        <section className="border border-border/40 rounded-2xl bg-surface p-6 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-muted/10 border border-border/30 flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-muted" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Contenido popular</h2>
          <p className="text-[14px] text-muted leading-relaxed">
            El ranking por reacciones vive ahora en Kontorōru, en{" "}
            <span className="text-foreground/80 font-medium">Complementos → Reacciones</span>.
            Los conteos previos a la migración quedaron respaldados en{" "}
            <code className="text-[13px] px-1 py-0.5 rounded bg-muted/10 border border-border/30">
              MIGRACION_LIKES.md
            </code>.
          </p>
        </section>
      </div>
    </div>
  );
}
