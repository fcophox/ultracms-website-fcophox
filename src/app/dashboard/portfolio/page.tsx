"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon, Plus, Settings, Edit, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { EmptyState } from "@/components/empty-state";
import { PortfolioConfigDrawer } from "@/components/portfolio-config-drawer";

export default function PortfolioPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch all portfolio items ordered by created_at desc
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching portfolio items for dashboard:", error);
      } else {
        setItems(data || []);
      }
      setIsLoading(false);
    };

    fetchItems();
  }, [supabase]);

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

  if (isLoading) {
    return (
      <div className="px-12 pb-20 pt-10 flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="px-12 pb-20 pt-10">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Portfolio</h1>
          <p className="text-sm text-muted mt-1">Administra los proyectos y trabajos de tu portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-full bg-muted/10 text-foreground hover:bg-muted/20 transition-colors"
            title="Configurar portfolio"
          >
            <Settings size={18} />
          </button>
          <Link
            href="/dashboard/portfolio/new"
            className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Plus size={16} />
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {/* Main Table or Empty State */}
      {!items || items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No portfolio items yet"
          description="You haven't added any portfolio items. Create your first project to showcase your work."
          actionLabel="Create Portfolio Item"
          actionHref="/dashboard/portfolio/new"
        />
      ) : (
        <div className="border border-border/60 rounded-xl bg-surface overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_150px_140px_150px] gap-4 px-6 py-4 border-b border-border/60 bg-surface">
            <div>Imagen</div>
            <div className="text-xs font-medium text-muted">Título</div>
            <div className="text-xs font-medium text-muted">Categoría</div>
            <div className="text-xs font-medium text-muted">Estado</div>
            <div className="text-xs font-medium text-muted text-right pr-4">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/60">
            {items.map((item: any) => (
              <div key={item.id} className="grid grid-cols-[60px_1fr_150px_140px_150px] items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                {/* Imagen */}
                <div className="w-10 h-10 rounded overflow-hidden relative border border-border bg-background flex items-center justify-center">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted/60" />
                  )}
                </div>

                {/* Título & Fecha */}
                <div className="truncate pr-4">
                  <div className="text-[13px] text-foreground/90 font-semibold truncate">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted mt-0.5">
                    {formatDate(item.created_at)}
                  </div>
                </div>

                {/* Categoría */}
                <div className="text-xs text-muted">
                  {item.category || "-"}
                </div>

                {/* Estado */}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    item.published
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}>
                    {item.published ? "Publicado" : "Borrador"}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2 pr-4">
                  <Link
                    href={`/dashboard/portfolio/edit/${item.id}`}
                    className="p-1.5 rounded-lg hover:bg-muted/10 transition-colors text-muted hover:text-foreground"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Config Drawer */}
      <PortfolioConfigDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}
