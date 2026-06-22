"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Calendar, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createClient } from "@/utils/supabase/client";
import { generateSlug, generateEnglishSlug } from "@/utils/slugify";

export default function EditServicePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const id = params.id;
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
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

      const { data, error } = await supabase.storage
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

  // English Form State
  const [titleEn, setTitleEn] = useState("");
  const [slugEn, setSlugEn] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const slugTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadService() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setContent(data.content || "");
          setCategory(data.category || "");
          setPublishedAt(data.published_at ? new Date(data.published_at).toISOString().split('T')[0] : "");
          setImageUrl(data.image_url || "");
          setTitleEn(data.title_en || "");
          setSlugEn(data.slug_en || "");
          setContentEn(data.content_en || "");
        }
      } catch (error) {
        console.error("Error loading service:", error);
        setModalConfig({
          isOpen: true,
          type: 'error',
          title: 'Error de carga',
          message: 'No se pudo cargar el servicio. Por favor intenta de nuevo.'
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadService();
  }, [id, supabase]);

  // Auto-generate slug from title (always in English)
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (slugTimerRef.current) clearTimeout(slugTimerRef.current);
    if (!value.trim()) {
      setSlug("");
      return;
    }
    setIsGeneratingSlug(true);
    slugTimerRef.current = setTimeout(async () => {
      const englishSlug = await generateEnglishSlug(value);
      setSlug(englishSlug);
      setIsGeneratingSlug(false);
    }, 600);
  };

  const handleTitleEnChange = (value: string) => {
    setTitleEn(value);
    if (!value.trim()) {
      setSlugEn("");
      return;
    }
    setSlugEn(generateSlug(value));
  };

  const handleSave = async () => {
    if (!title) {
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Faltan campos',
        message: 'El título del servicio es requerido en español.'
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("services")
        .update({
          title,
          slug,
          content,
          category,
          published_at: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
          image_url: imageUrl || null,
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
        title: '¡Servicio guardado!',
        message: 'Los cambios se han actualizado correctamente.',
        onConfirm: () => router.push("/dashboard/services")
      });
    } catch (error: any) {
      console.error("Error updating service:", error);
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: 'Error al guardar',
        message: error.message || 'Ocurrió un problema al guardar los cambios del servicio.'
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
      if (data.title) {
        setTitleEn(data.title);
        const generated = data.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        setSlugEn(generated);
      }
      if (data.content) setContentEn(data.content);

      setCurrentLanguage('en');

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Traducción completada',
        message: 'El contenido del servicio ha sido traducido al inglés. Recuerda guardar los cambios.'
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
          <Link href="/dashboard/services" className="w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center hover:bg-muted/20 transition-colors border border-border/50">
            <ArrowLeft className="w-4 h-4 text-muted" />
          </Link>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Editar Servicio</h1>

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
                disabled={isTranslating || !title}
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
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            {isSaving ? "Guardando..." : "Guardar Cambios"}
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
                placeholder={currentLanguage === 'es' ? "Título del Servicio..." : "Service Title..."}
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
              placeholder={currentLanguage === 'es' ? "Describe el servicio en detalle..." : "Describe the service in detail..."}
            />

          </div>

          {/* Right Column - Meta */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">

            <div className="p-6 rounded-xl border border-border/60 bg-surface flex flex-col gap-8">

              {/* Cover Image */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center border border-border">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500" />
                  </div>
                  <h3 className="text-[13px] font-semibold text-foreground">Imagen del Servicio</h3>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-foreground/90">Subir Imagen</label>
                  <input
                    type="file"
                    id="service-image-upload"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {imageUrl ? (
                    <div className="relative group rounded-xl overflow-hidden border border-border h-[140px]">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-all duration-200">
                        <label
                          htmlFor="service-image-upload"
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
                      htmlFor="service-image-upload"
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
                  {/* Keep text input underneath for flexibility */}
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
                <label className="text-[13px] font-semibold text-foreground/90">Categoría o Badge</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ej: UX Strategy, Frontend, IA Consulting"
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

            </div>

          </div>

        </div>
      </div>

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
                El sistema traducirá automáticamente el título y el contenido. Esto reemplazará la versión en inglés si ya existe.
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
