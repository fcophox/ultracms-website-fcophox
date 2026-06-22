"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createClient } from "@/utils/supabase/client";
import { generateSlug, generateEnglishSlug } from "@/utils/slugify";

export default function NewArticlePage() {
  const router = useRouter();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');
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

  // Form State (Spanish)
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [hasPdf, setHasPdf] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // English Form State
  const [titleEn, setTitleEn] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        .from('article-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('article-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error de carga',
        message: error.message || 'No se pudo subir la imagen.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Auto-generate slug from title (always in English)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    if (!val.trim()) {
      setSlug("");
      return;
    }
    setIsGeneratingSlug(true);
    slugTimerRef.current = setTimeout(async () => {
      const englishSlug = await generateEnglishSlug(val);
      setSlug(englishSlug);
      setIsGeneratingSlug(false);
    }, 600);
  };

  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (!val.trim()) {
      setSlugEn("");
      return;
    }
    setSlugEn(generateSlug(val));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Faltan campos',
        message: 'El título del artículo es requerido.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("articles")
        .insert([{
          title,
          slug: slug || generateSlug(title),
          content,
          category,
          status,
          published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
          image_url: imageUrl || null,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
          download_url: hasPdf ? "yes" : null,
          title_en: titleEn,
          slug_en: slugEn,
          content_en: contentEn,
        }]);

      if (error) throw error;

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: status === 'published' ? '¡Artículo publicado!' : '¡Borrador guardado!',
        message: status === 'published'
          ? 'El artículo ha sido publicado correctamente.'
          : 'El artículo se ha guardado como borrador.',
        onConfirm: () => router.push("/dashboard/articles")
      });
    } catch (error: any) {
      console.error("Error creating article:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error al guardar',
        message: error.message || 'Ocurrió un problema al guardar el artículo.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      {/* Top Bar (Editor Header) */}
      <header className="h-[80px] flex items-center justify-between px-10 border-b border-transparent shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/articles" className="w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center hover:bg-muted/20 transition-colors border border-border/50">
            <ArrowLeft className="w-4 h-4 text-muted" />
          </Link>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Crear Nuevo Artículo</h1>

          {/* Language Switcher */}
          <div className="ml-2 flex items-center bg-surface border border-border/60 rounded-full p-1">
            <button
              onClick={() => setCurrentLanguage('es')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${currentLanguage === 'es' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-foreground'}`}
            >
              Español
            </button>
            <button
              onClick={() => setCurrentLanguage('en')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${currentLanguage === 'en' ? 'bg-primary text-white shadow-md' : 'text-muted hover:text-foreground'}`}
            >
              English
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Borrador"}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Publicar"}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">

          {/* Left Column - Editor */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Title Block */}
            <div className="p-6 rounded-xl border border-border/60 bg-surface flex flex-col gap-4">
              <input
                type="text"
                placeholder={currentLanguage === 'es' ? "Título del Artículo..." : "Article Title..."}
                value={currentLanguage === 'es' ? title : titleEn}
                onChange={(e) => currentLanguage === 'es' ? handleTitleChange(e.target.value) : handleTitleEnChange(e.target.value)}
                className="w-full bg-transparent text-3xl font-medium text-foreground/80 placeholder:text-muted/50 focus:outline-none"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-muted tracking-wider">Slug {currentLanguage === 'en' && '(English)'}</label>
                  {isGeneratingSlug && currentLanguage === 'es' && (
                    <span className="text-[10px] text-primary flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Traduciendo...</span>
                  )}
                  <span className="text-[10px] text-muted/50 ml-auto">Auto-generado en inglés</span>
                </div>
                <input
                  type="text"
                  value={currentLanguage === 'es' ? slug : slugEn}
                  readOnly
                  className="h-12 rounded-lg bg-background border border-transparent px-4 flex items-center text-muted/80 font-mono text-[13px] focus:outline-none cursor-default"
                  placeholder={currentLanguage === 'es' ? "se-genera-automaticamente" : "auto-generated"}
                />
              </div>
            </div>

            {/* Editor Block */}
            <RichTextEditor
              key={currentLanguage}
              content={currentLanguage === 'es' ? content : contentEn}
              onChange={currentLanguage === 'es' ? setContent : setContentEn}
              placeholder={currentLanguage === 'es' ? "Escribe algo increíble..." : "Write something amazing..."}
            />

          </div>

          {/* Right Column - Meta */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">

            <div className="p-6 rounded-xl border border-border/60 bg-surface flex flex-col gap-8">

              {/* Cover Image */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center border border-border">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-green-400 to-blue-500" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground">Imagen de Portada</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground/90">Subir Imagen</label>
                  <input
                    type="file"
                    id="article-image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {imageUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-border h-[140px]">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-200">
                        <label
                          htmlFor="article-image-upload"
                          className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-white hover:text-primary transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          Cambiar
                        </label>
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="article-image-upload"
                      className="h-[140px] rounded-xl border-2 border-dashed border-border/80 hover:border-border bg-background transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                          <span className="text-[13px] text-muted font-medium">Subiendo imagen...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-muted/80" strokeWidth={1.5} />
                          <span className="text-[13px] text-muted font-medium">Click para subir una imagen</span>
                        </>
                      )}
                    </label>
                  )}
                  <div className="mt-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-wider">O URL de la imagen</label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="h-[36px] w-full rounded-lg bg-background border border-transparent px-3 text-foreground text-[11px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Categoría */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Categoría</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: UX Design, React, Tutorial"
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Fecha */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Fecha de Publicación</label>
                <div className="relative">
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full h-[46px] rounded-lg bg-background border border-transparent pl-4 pr-4 text-foreground text-[13px] focus:outline-none focus:border-border transition-colors"
                  />
                </div>
              </div>

              {/* Etiquetas */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Etiquetas Asociadas (separadas por coma)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ej: ui, web, tips"
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

            </div>

            {/* Toggle PDF */}
            <div className="px-6 py-5 rounded-xl border border-border/60 bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-surface/50 flex items-center justify-center border border-border/80 overflow-hidden relative">
                  <div className="w-4 h-4 bg-red-600 rounded-[3px] flex items-center justify-center">
                    <span className="text-[6px] font-bold text-foreground tracking-tighter">PDF</span>
                  </div>
                </div>
                <span className="text-[13px] font-medium text-foreground">Descargable</span>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setHasPdf(!hasPdf)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex items-center ${hasPdf ? 'bg-[#4F46E5]' : 'bg-muted/20'}`}
                >
                  <span className={`absolute w-3.5 h-3.5 rounded-full bg-foreground transition-all duration-300 ${hasPdf ? 'left-[22px]' : 'left-[3px]'}`}></span>
                </button>
                <span className="text-[11px] font-bold text-foreground hidden sm:block">¿Quieres agregar un PDF?</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Custom Modal */}
      <AnimatePresence>
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-surface border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modalConfig.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {modalConfig.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{modalConfig.title}</h3>
              <p className="text-sm text-muted mb-6">{modalConfig.message}</p>
              <button
                onClick={() => {
                  setModalConfig(prev => ({ ...prev, isOpen: false }));
                  if (modalConfig.onConfirm) modalConfig.onConfirm();
                }}
                className="w-full py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors"
              >
                {modalConfig.type === 'success' ? 'Continuar' : 'Entendido'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
