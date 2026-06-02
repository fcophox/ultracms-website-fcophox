import Link from "next/link";
import Image from "next/image";
import { Briefcase, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 0; // Always real-time in the admin panel

export default async function CaseStudiesPage() {
  const supabase = await createClient();

  // Fetch all case studies ordered by created_at desc
  const { data: cases, error } = await supabase
    .from("case_studies")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching case studies for dashboard:", error);
  }

  const fallbackImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=100&h=100&q=80";

  // Date formatter
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="px-12 pb-20 pt-10">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Casos de Estudio</h1>
          <p className="text-sm text-muted mt-1">Administra los casos de estudio que se muestran en tu portfolio público.</p>
        </div>
        <Link 
          href="/dashboard/case-studies/new" 
          className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Plus size={16} />
          Nuevo Caso
        </Link>
      </div>

      {/* Main Table or Empty State */}
      {!cases || cases.length === 0 ? (
        <EmptyState 
          icon={Briefcase}
          title="No case studies yet"
          description="Your portfolio is empty. Add a case study to show potential clients your process and results."
          actionLabel="Add Case Study"
          actionHref="/dashboard/case-studies/new"
        />
      ) : (
        <div className="border border-border/60 rounded-xl bg-surface overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_150px_140px_80px_150px] gap-4 px-6 py-4 border-b border-border/60 bg-surface">
            <div>Portada</div>
            <div className="text-xs font-medium text-muted">Título</div>
            <div className="text-xs font-medium text-muted">Rol / Tipo</div>
            <div className="text-xs font-medium text-muted">Estado</div>
            <div className="text-xs font-medium text-muted text-right">Likes</div>
            <div className="text-xs font-medium text-muted text-right pr-4">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/60">
            {cases.map((c) => (
              <div key={c.id} className="grid grid-cols-[60px_1fr_150px_140px_80px_150px] items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                {/* Portada */}
                <div className="w-10 h-10 rounded overflow-hidden relative border border-border">
                  <Image 
                    src={c.image_url || fallbackImage} 
                    alt={c.title} 
                    fill 
                    className="object-cover" 
                    sizes="40px" 
                  />
                </div>

                {/* Título & Fecha */}
                <div className="truncate pr-4">
                  <div className="text-[13px] text-foreground/90 font-semibold truncate">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-muted/80 mt-0.5">
                    Fecha del Proyecto: {formatDate(c.published_at || c.created_at)}
                  </div>
                </div>

                {/* Rol / Categoría */}
                <div className="text-[13px] text-muted">
                  {c.category || "-"}
                </div>

                {/* Estado */}
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                    c.status === "published"
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  }`}>
                    {c.status === "published" ? "Publicado" : "Borrador"}
                  </span>
                </div>

                {/* Likes */}
                <div className="text-[13px] font-semibold text-foreground text-right">
                  {c.likes ?? 0}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-3 pr-4">
                  <Link 
                    href={`/case-studies/${c.slug}`} 
                    target="_blank" 
                    className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-foreground hover:border-border transition-all"
                    title="Ver en web"
                  >
                    <Eye size={14} />
                  </Link>
                  <Link 
                    href={`/dashboard/case-studies/edit/${c.id}`}
                    className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-foreground hover:border-border transition-all"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </Link>
                  <button 
                    className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-red-400 hover:border-red-950 transition-all cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
