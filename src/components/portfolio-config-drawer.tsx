"use client";

import { useState, useEffect } from "react";
import { X, Grid3x3, List, LayoutGrid, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

type TemplateType = "grid" | "list" | "masonry";

interface PortfolioConfig {
  id?: string;
  template_type: TemplateType;
  visible: boolean;
}

interface PortfolioConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const templates = [
  {
    id: "grid",
    name: "Grid de Tarjetas",
    description: "Muestra los proyectos en una cuadrícula de tarjetas con imagen y título.",
    icon: Grid3x3,
  },
  {
    id: "list",
    name: "Lista Detallada",
    description: "Muestra los proyectos en una lista con descripción completa y detalles.",
    icon: List,
  },
  {
    id: "masonry",
    name: "Galería Masonry",
    description: "Muestra los proyectos en una galería tipo masonry con imágenes de tamaño variable.",
    icon: LayoutGrid,
  },
];

export function PortfolioConfigDrawer({ isOpen, onClose }: PortfolioConfigDrawerProps) {
  const supabase = createClient();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("grid");
  const [isVisible, setIsVisible] = useState(false);
  const [configId, setConfigId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  // Cargar configuración actual
  useEffect(() => {
    if (isOpen) {
      loadConfig();
    }
  }, [isOpen]);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("portfolio_config")
        .select("id, template_type, visible")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setConfigId(data.id);
        setSelectedTemplate((data.template_type as TemplateType) || "grid");
        setIsVisible(data.visible || false);
      }
    } catch (error: any) {
      console.error("Error loading config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (configId) {
        // Actualizar configuración existente
        const { error } = await supabase
          .from("portfolio_config")
          .update({
            template_type: selectedTemplate,
            visible: isVisible
          })
          .eq("id", configId);

        if (error) throw error;
      } else {
        // Crear nueva configuración
        const { error } = await supabase
          .from("portfolio_config")
          .insert([{
            template_type: selectedTemplate,
            visible: isVisible
          }]);

        if (error) throw error;
      }

      setModalConfig({
        isOpen: true,
        type: "success",
        title: "¡Éxito!",
        message: "La configuración del portfolio ha sido guardada.",
      });

      setTimeout(() => {
        setModalConfig({ ...modalConfig, isOpen: false });
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Error saving config:", error);
      setModalConfig({
        isOpen: true,
        type: "error",
        title: "Error",
        message: error.message || "No se pudo guardar la configuración.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l border-border/60 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/60">
              <div>
                <h2 className="text-xl font-bold text-foreground">Configurar Portfolio</h2>
                <p className="text-xs text-muted mt-1">Elige cómo mostrar tus proyectos</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Templates Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Plantilla de Visualización</h3>
                    <div className="space-y-2">
                      {templates.map((template) => {
                        const Icon = template.icon;
                        const isSelected = selectedTemplate === template.id;

                        return (
                          <motion.button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id as TemplateType)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border/40 bg-background hover:border-border/60"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Icon
                                size={24}
                                className={`mt-1 flex-shrink-0 ${
                                  isSelected ? "text-primary" : "text-muted"
                                }`}
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground text-sm">
                                  {template.name}
                                </h3>
                                <p className="text-xs text-muted mt-1">{template.description}</p>
                              </div>
                              {isSelected && (
                                <CheckCircle2 size={20} className="text-primary flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visibility Section */}
                  <div className="border-t border-border/40 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Publicar en Web</h3>
                        <p className="text-xs text-muted mt-1">
                          {isVisible
                            ? "Portfolio visible en fcophox.com/portfolio"
                            : "Portfolio oculto (no visible en la web)"}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsVisible(!isVisible)}
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          isVisible
                            ? "bg-emerald-500/30 border border-emerald-500/50"
                            : "bg-muted/20 border border-border/40"
                        }`}
                      >
                        <motion.div
                          animate={{ x: isVisible ? 20 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-5 h-5 rounded-full bg-foreground"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border/60 space-y-3 bg-background">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-5 py-3 rounded-lg bg-primary text-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Configuración"
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full px-5 py-3 rounded-lg bg-muted/10 text-foreground font-semibold hover:bg-muted/20 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border/60 rounded-xl p-6 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                {modalConfig.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{modalConfig.title}</h3>
                  <p className="text-sm text-muted mb-4">{modalConfig.message}</p>
                  <button
                    onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
