"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Image as ImageIcon, Plus, Settings, Edit, Trash2, Loader2, GripVertical, CheckCircle2 } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { EmptyState } from "@/components/empty-state";
import { PortfolioConfigDrawer } from "@/components/portfolio-config-drawer";

export default function PortfolioPage() {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Fetch all portfolio items ordered by custom sort_order or created_at
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      const { data: portfolioData, error } = await supabase
        .from("portfolio")
        .select("*");

      if (error) {
        console.error("Error fetching portfolio items for dashboard:", error);
        setIsLoading(false);
        return;
      }

      let fetchedItems = portfolioData || [];

      // Sort items by sort_order / order_index / position or created_at
      fetchedItems.sort((a: any, b: any) => {
        const orderA = a.sort_order ?? a.order_index ?? a.position;
        const orderB = b.sort_order ?? b.order_index ?? b.position;

        if (orderA !== undefined && orderB !== undefined && orderA !== null && orderB !== null) {
          return orderA - orderB;
        }

        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setItems(fetchedItems);
      setIsLoading(false);
    };

    fetchItems();
  }, []);

  const handleReorder = async (newItems: any[]) => {
    setItems(newItems);
    try {
      // Update sort_order on portfolio items
      const updates = newItems.map((item, index) =>
        supabase
          .from("portfolio")
          .update({ sort_order: index })
          .eq("id", item.id)
      );
      await Promise.all(updates);

      // Show success toast
      triggerToast();
    } catch (error) {
      console.error("Error persisting portfolio order:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proyecto del portfolio?")) {
      return;
    }
    try {
      const { error } = await supabase.from("portfolio").delete().eq("id", id);
      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
    }
  };

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
          <p className="text-sm text-muted mt-1">Administra y reordena los proyectos de tu portfolio arrastrando cada fila.</p>
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
          <div className="grid grid-cols-[36px_60px_1fr_150px_140px_150px] gap-4 px-6 py-4 border-b border-border/60 bg-surface items-center">
            <div className="text-xs font-medium text-muted text-center"></div>
            <div className="text-xs font-medium text-muted">Imagen</div>
            <div className="text-xs font-medium text-muted">Título</div>
            <div className="text-xs font-medium text-muted">Categoría</div>
            <div className="text-xs font-medium text-muted">Estado</div>
            <div className="text-xs font-medium text-muted text-right pr-4">Acciones</div>
          </div>

          {/* Reorderable Table Body */}
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="divide-y divide-zinc-800/60">
            {items.map((item: any) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="grid grid-cols-[36px_60px_1fr_150px_140px_150px] items-center gap-4 px-6 py-4 bg-surface hover:bg-surface/60 transition-colors select-none"
              >
                {/* Drag Handle Icon on Left */}
                <div
                  className="cursor-grab active:cursor-grabbing text-muted/40 hover:text-foreground flex items-center justify-center p-1 rounded transition-colors"
                  title="Arrastrar para ordenar"
                >
                  <GripVertical size={18} />
                </div>

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
                <div className="text-xs text-muted truncate">
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
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted hover:text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      )}

      {/* Portfolio Config Drawer */}
      <PortfolioConfigDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface/90 backdrop-blur-md border border-emerald-500/30 text-foreground shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Orden actualizado</span>
              <span className="text-xs text-muted">El nuevo orden del portfolio fue guardado con éxito.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
