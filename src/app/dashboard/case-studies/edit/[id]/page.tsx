"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createClient } from "@/utils/supabase/client";

export default function EditCaseStudyPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = params.id;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, type: 'success' | 'error', title: string, message: string, onConfirm?: () => void }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [hasPdf, setHasPdf] = useState(false);

  // English Form State
  const [titleEn, setTitleEn] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const { data, error } = await supabase
          .from("case_studies")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setContent(data.content || "");
          setCategory(data.category || "");
          // Assuming we store client somewhere. We can use a JSON field or ignore if it doesn't exist
          // setClientName(data.client || ""); 
          setPublishedAt(data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : "");
          setImageUrl(data.image_url || "");
          setHasPdf(!!data.download_url);
          setTitleEn(data.title_en || "");
          setSlugEn(data.slug_en || "");
          setContentEn(data.content_en || "");
        }
      } catch (error) {
        console.error("Error loading case study:", error);
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Error de carga',
          message: 'No se pudo cargar el caso de estudio. Por favor intenta de nuevo.'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, [id, supabase]);

  const handleSave = async (status: "draft" | "published") => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("case_studies")
        .update({
          title,
          slug,
          content,
          category,
          status,
          published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
          image_url: imageUrl,
          download_url: hasPdf ? "yes" : null,
          title_en: titleEn,
          slug_en: slugEn,
          content_en: contentEn,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: '¡Guardado exitoso!',
        message: 'El caso de estudio ha sido actualizado correctamente.',
        onConfirm: () => router.push("/dashboard/case-studies")
      });
    } catch (error) {
      console.error("Error updating case study:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error al guardar',
        message: 'Ocurrió un problema al guardar los cambios. Intenta nuevamente.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTranslate = async () => {
    setIsTranslateModalOpen(false);
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });
      if (!response.ok) throw new Error("Translation failed");
      
      const data = await response.json();
      if (data.title) setTitleEn(data.title);
      if (data.slug) setSlugEn(data.slug);
      if (data.content) setContentEn(data.content);

      setCurrentLanguage('en');

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Traducción completada',
        message: 'El contenido ha sido traducido exitosamente. Recuerda guardar los cambios.'
      });
    } catch (error) {
      console.error("Translation error:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error de Traducción',
        message: 'Ocurrió un error al intentar traducir el contenido.'
      });
    } finally {
      setIsTranslating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 text-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      {/* Top Bar (Editor Header) */}
      <header className="h-[80px] flex items-center justify-between px-10 border-b border-transparent shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/case-studies" className="w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center hover:bg-muted/20 transition-colors border border-border/50">
            <ArrowLeft className="w-4 h-4 text-muted" />
          </Link>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Editar Caso de Estudio</h1>

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

          {/* Translate Button */}
          {currentLanguage === 'es' && (
            <div className="ml-4">
              <button
                onClick={() => setIsTranslateModalOpen(true)}
                disabled={isTranslating}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-white text-[12px] font-semibold hover:bg-secondary/90 transition-all shadow-sm disabled:opacity-50"
              >
                {isTranslating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Generar versión en Inglés
              </button>
            </div>
          )}

        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            Guardar Borrador
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            Publicar Cambios
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">

          {/* Left Column - Editor */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Title Block */}
            <div className="p-6 rounded-xl border border-border/60 bg-surface flex flex-col gap-4 relative">

              <input
                type="text"
                placeholder={currentLanguage === 'es' ? "Título del Caso de Estudio..." : "Case Study Title..."}
                value={currentLanguage === 'es' ? title : titleEn}
                onChange={(e) => currentLanguage === 'es' ? setTitle(e.target.value) : setTitleEn(e.target.value)}
                className="w-full bg-transparent text-3xl font-medium text-foreground/80 placeholder:text-muted/50 focus:outline-none"
              />
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted tracking-wider">Slug {currentLanguage === 'en' && '(English)'}</label>
                <input
                  type="text"
                  value={currentLanguage === 'es' ? slug : slugEn}
                  onChange={(e) => currentLanguage === 'es' ? setSlug(e.target.value) : setSlugEn(e.target.value)}
                  className="h-12 rounded-lg bg-background border border-transparent px-4 flex items-center text-muted/80 font-mono text-[13px] focus:outline-none"
                  placeholder={currentLanguage === 'es' ? "url-amigable" : "friendly-url"}
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
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground">Imagen de Portada</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground/90">Cover Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                  />
                  {imageUrl && (
                    <div className="mt-2 h-[140px] rounded-xl overflow-hidden relative border border-border">
                      <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Cliente */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Cliente o Empresa</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej: Startup Fintech..."
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Categoría / Rol */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Rol desempeñado</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: Lead UX Designer, Frontend Dev"
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Fecha */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Fecha del Proyecto</label>
                <div className="relative">
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full h-[46px] rounded-lg bg-background border border-transparent pl-4 pr-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                  />
                </div>
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
                <span className="text-[11px] font-bold text-foreground hidden sm:block">¿Adjuntar deck?</span>
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
      <AnimatePresence>
        {isTranslateModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm bg-surface border border-border/60 rounded-2xl p-6 flex flex-col items-center text-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-yellow-500/10 text-yellow-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">¿Generar versión en Inglés?</h3>
              <p className="text-sm text-muted mb-6">
                El sistema traducirá automáticamente el título, slug y contenido. Esto reemplazará la versión en inglés si ya existe.
              </p>
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setIsTranslateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-muted/10 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleTranslate}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
