"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  Calendar
} from "lucide-react";
import { RichTextEditor } from "@/components/rich-text-editor";
import { createClient } from "@/utils/supabase/client";

export default function NewCaseStudyPage() {
  const [hasPdf, setHasPdf] = useState(false);
  const [content, setContent] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en'>('es');

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      {/* Top Bar (Editor Header) */}
      <header className="h-[80px] flex items-center justify-between px-10 border-b border-transparent shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/case-studies" className="w-10 h-10 rounded-full bg-surface/80 flex items-center justify-center hover:bg-muted/20 transition-colors border border-border/50">
            <ArrowLeft className="w-4 h-4 text-muted" />
          </Link>
          <h1 className="text-[22px] font-semibold text-foreground tracking-tight">Crear Nuevo Caso de Estudio</h1>

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
          <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors">
            Borrador
          </button>
          <button className="px-6 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Publicar
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
                placeholder={currentLanguage === 'es' ? "Título del Caso de Estudio..." : "Case Study Title..."}
                className="w-full bg-transparent text-3xl font-medium text-foreground/80 placeholder:text-muted/50 focus:outline-none"
              />
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-muted tracking-wider">Slug {currentLanguage === 'en' && '(English)'}</label>
                <div className="h-12 rounded-lg bg-background border border-transparent px-4 flex items-center text-muted/80 font-mono text-[13px]">
                  {currentLanguage === 'es' ? "url-amigable" : "friendly-url"}
                </div>
              </div>
            </div>

            {/* Editor Block */}
            <RichTextEditor 
              key={currentLanguage}
              content={content} 
              onChange={setContent} 
              placeholder={currentLanguage === 'es' ? "Describe el proceso, los retos y los resultados..." : "Describe the process, challenges, and results..."} 
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
                  <label className="text-xs font-semibold text-foreground/90">Cover Image</label>
                  <button className="h-[140px] rounded-xl border-2 border-dashed border-border/80 hover:border-border bg-background hover:bg-background transition-colors flex flex-col items-center justify-center gap-3">
                    <Camera className="w-6 h-6 text-muted/80" strokeWidth={1.5} />
                    <span className="text-[13px] text-muted font-medium">Click to upload an image</span>
                  </button>
                </div>
              </div>

              {/* Cliente */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Cliente o Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Startup Fintech..."
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Categoría */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Rol desempeñado</label>
                <input
                  type="text"
                  placeholder="Ej: Lead UX Designer, Frontend Dev"
                  className="h-[46px] rounded-lg bg-background border border-transparent px-4 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                />
              </div>

              {/* Fecha */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-foreground/90">Fecha del Proyecto</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mes Año"
                    className="w-full h-[46px] rounded-lg bg-background border border-transparent pl-4 pr-10 text-foreground text-[13px] placeholder:text-muted/60 focus:outline-none focus:border-border transition-colors"
                  />
                  <Calendar className="w-4 h-4 text-muted/80 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.5} />
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
    </div>
  );
}
