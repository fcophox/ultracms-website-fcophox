"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Wrench, Plus, Edit, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { EmptyState } from "@/components/empty-state";

export default function ServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "confirm";
    title: string;
    message: string;
    targetId?: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  async function fetchServices() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const confirmDelete = (id: string) => {
    setModalConfig({
      isOpen: true,
      type: "confirm",
      title: "¿Eliminar servicio?",
      message: "Esta acción no se puede deshacer. El servicio se borrará de forma permanente.",
      targetId: id,
    });
  };

  const handleDelete = async (id: string) => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
    setIsDeletingId(id);
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Update state
      setServices((prev) => prev.filter((s) => s.id !== id));
      
      setModalConfig({
        isOpen: true,
        type: "success",
        title: "¡Servicio eliminado!",
        message: "El servicio ha sido eliminado correctamente del sistema.",
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error al eliminar",
        message: "Hubo un problema al intentar eliminar el servicio. Intenta de nuevo.",
      });
    } finally {
      setIsDeletingId(null);
    }
  };

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

  const fallbackImage = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=100&h=100&q=80";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] bg-background">
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-12 pb-20 pt-10">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Servicios</h1>
          <p className="text-sm text-muted mt-1">Administra los servicios que ofreces y se muestran en la página principal.</p>
        </div>
        <Link 
          href="/dashboard/services/new" 
          className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Plus size={16} />
          Nuevo Servicio
        </Link>
      </div>

      {/* Main Table or Empty State */}
      {services.length === 0 ? (
        <EmptyState 
          icon={Wrench}
          title="No services configured"
          description="You haven't listed any services. Add your professional offerings to help clients understand what you do."
          actionLabel="Add Service"
          actionHref="/dashboard/services/new"
        />
      ) : (
        <div className="border border-border/60 rounded-xl bg-surface overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_180px_160px_120px] gap-4 px-6 py-4 border-b border-border/60 bg-surface">
            <div>Portada</div>
            <div className="text-xs font-medium text-muted">Título</div>
            <div className="text-xs font-medium text-muted">Categoría</div>
            <div className="text-xs font-medium text-muted">Fecha</div>
            <div className="text-xs font-medium text-muted text-right pr-4">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/60">
            {services.map((service) => (
              <div key={service.id} className="grid grid-cols-[60px_1fr_180px_160px_120px] items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                {/* Portada */}
                <div className="w-10 h-10 rounded overflow-hidden relative border border-border bg-background">
                  <Image 
                    src={service.image_url || fallbackImage} 
                    alt={service.title} 
                    fill 
                    className="object-cover" 
                    sizes="40px" 
                  />
                </div>

                {/* Título & Slug */}
                <div className="truncate pr-4">
                  <div className="text-[13px] text-foreground/90 font-semibold truncate">
                    {service.title}
                  </div>
                  <div className="text-[11px] text-muted/80 mt-0.5 font-mono">
                    /{service.slug}
                  </div>
                </div>

                {/* Categoría */}
                <div className="text-[13px] text-muted">
                  {service.category || "-"}
                </div>

                {/* Fecha */}
                <div className="text-[13px] text-muted">
                  {formatDate(service.published_at || service.created_at)}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-3 pr-4">
                  <Link 
                    href={`/dashboard/services/edit/${service.id}`}
                    className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-foreground hover:border-border transition-all"
                    title="Editar"
                  >
                    <Edit size={14} />
                  </Link>
                  <button 
                    onClick={() => confirmDelete(service.id)}
                    disabled={isDeletingId === service.id}
                    className="w-8 h-8 rounded-lg bg-surface border border-border/60 flex items-center justify-center text-muted hover:text-red-400 hover:border-red-950 transition-all cursor-pointer disabled:opacity-50"
                    title="Eliminar"
                  >
                    {isDeletingId === service.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation & Alert Modals */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-surface border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                modalConfig.type === 'success' 
                  ? 'bg-green-500/10 text-green-500' 
                  : modalConfig.type === 'error'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {modalConfig.type === 'success' && <CheckCircle2 className="w-6 h-6" />}
                {modalConfig.type === 'error' && <AlertCircle className="w-6 h-6" />}
                {modalConfig.type === 'confirm' && <AlertCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{modalConfig.title}</h3>
              <p className="text-sm text-muted mb-6">{modalConfig.message}</p>
              
              {modalConfig.type === 'confirm' ? (
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                    className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => modalConfig.targetId && handleDelete(modalConfig.targetId)}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors"
                >
                  Entendido
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
