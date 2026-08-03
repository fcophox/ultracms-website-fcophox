"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createClient } from "@/utils/supabase/client";

export default function NewPortfolioPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      let errorMessage = 'No se pudo subir la imagen.';

      if (error.message?.includes('row-level security')) {
        errorMessage = 'Error de seguridad. Verifica que el bucket "portfolio-images" tenga las políticas RLS correctas en Supabase.';
      } else if (error.message?.includes('Bucket not found')) {
        errorMessage = 'El bucket "portfolio-images" no existe. Créalo en Storage de Supabase.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error de carga',
        message: errorMessage
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Faltan campos',
        message: 'El título del proyecto es requerido.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("portfolio")
        .insert([{
          title,
          category,
          description,
          image_url: imageUrl || null,
          project_url: projectUrl || null,
          published: status === "published",
        }]);

      if (error) throw error;

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: '¡Éxito!',
        message: `El proyecto ha sido ${status === "published" ? "publicado" : "guardado como borrador"}.`,
        onConfirm: () => router.push('/dashboard/portfolio')
      });
    } catch (error: any) {
      console.error("Error saving portfolio item:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: error.message || 'No se pudo guardar el proyecto.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-12 pb-20 pt-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/portfolio"
          className="p-2 rounded-lg hover:bg-muted/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Proyecto</h1>
          <p className="text-sm text-muted mt-1">Agrega un nuevo proyecto a tu portfolio.</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-surface border border-border/60 rounded-xl p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Título del Proyecto *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Rediseño de sitio web de cliente..."
              className="w-full px-4 py-3 rounded-lg bg-background border border-border/40 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category */}
          <div className="bg-surface border border-border/60 rounded-xl p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Categoría
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Diseño Web, Marketing, Desarrollo..."
              className="w-full px-4 py-3 rounded-lg bg-background border border-border/40 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Description */}
          <div className="bg-surface border border-border/60 rounded-xl p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Descripción
            </label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Describe tu proyecto, desafíos, resultados..."
            />
          </div>

          {/* Project URL */}
          <div className="bg-surface border border-border/60 rounded-xl p-6">
            <label className="block text-sm font-semibold text-foreground mb-3">
              URL del Proyecto
            </label>
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://proyecto.com"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border/40 text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-surface border border-border/60 rounded-xl p-6">
            <label className="block text-sm font-semibold text-foreground mb-4">
              Imagen del Proyecto
            </label>
            <div className="relative">
              {imageUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border/40 mb-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 rounded-lg border-2 border-dashed border-border/40 flex flex-col items-center justify-center mb-4 hover:border-border/60 transition-colors">
                  <Camera className="w-8 h-8 text-muted/40 mb-2" />
                  <p className="text-xs text-muted text-center">Clic para subir imagen</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}
            </div>
            {imageUrl && (
              <button
                onClick={() => setImageUrl("")}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Cambiar imagen
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleSave("published")}
              disabled={isSaving}
              className="w-full px-5 py-3 rounded-lg bg-primary text-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Publicar Proyecto"
              )}
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="w-full px-5 py-3 rounded-lg bg-muted/10 text-foreground font-semibold hover:bg-muted/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar Borrador"
              )}
            </button>
            <Link
              href="/dashboard/portfolio"
              className="block text-center px-5 py-3 rounded-lg bg-background border border-border/40 text-foreground font-semibold hover:bg-background/80 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                {modalConfig.type === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {modalConfig.title}
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    {modalConfig.message}
                  </p>
                  <button
                    onClick={() => {
                      setModalConfig({ ...modalConfig, isOpen: false });
                      modalConfig.onConfirm?.();
                    }}
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
    </div>
  );
}
