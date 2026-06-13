"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Lock, Search, Compass, Layout, Sparkles, HelpCircle, FileCheck, Award, MessageSquare, Terminal } from "lucide-react";
import { promptStages, vibeCodingStages } from "./prompts-data";
import { createClient } from "@/utils/supabase/client";

export function PromptLibrary() {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("resources_unlocked") === "true";
    }
    return false;
  });
  const [activeLibrary, setActiveLibrary] = useState<"ux" | "vibe">("ux");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleUnlock = () => {
      setUnlocked(true);
    };

    window.addEventListener("resources-unlock", handleUnlock);
    return () => {
      window.removeEventListener("resources-unlock", handleUnlock);
    };
  }, []);

  const handleCopy = async (title: string, text: string, id: number) => {
    if (!unlocked) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);

    try {
      const supabase = createClient();
      await supabase
        .from("contact_messages")
        .insert([
          {
            name: "Prompt Copy",
            email: "copy@fcophox.com",
            message_type: "prompt_copy",
            message: title,
            status: "new",
            is_archived: false
          }
        ]);
    } catch (err) {
      console.error("Error logging prompt copy:", err);
    }
  };

  const getStageIcon = (icon: string) => {
    switch (icon) {
      case "search": return <Search className="w-4 h-4" />;
      case "puzzle": return <Compass className="w-4 h-4" />;
      case "lightbulb": return <Sparkles className="w-4 h-4" />;
      case "pencil": return <Layout className="w-4 h-4" />;
      case "test-tube": return <FileCheck className="w-4 h-4" />;
      case "megaphone": return <MessageSquare className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const currentStages = activeLibrary === "ux" ? promptStages : vibeCodingStages;

  // Filter prompts by active stage and search query
  const filteredStages = currentStages.map(stage => {
    // If we're filtering by a specific stage and this isn't it, skip
    if (activeStage !== "all" && stage.title !== activeStage) {
      return { ...stage, prompts: [] };
    }

    // Filter prompts inside this stage by search query
    const filteredPrompts = stage.prompts.filter(prompt =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.template.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return { ...stage, prompts: filteredPrompts };
  }).filter(stage => stage.prompts.length > 0);

  const totalFilteredCount = filteredStages.reduce((acc, stage) => acc + stage.prompts.length, 0);

  return (
    <section className="w-full max-w-6xl mx-auto px-6 relative z-10 py-16 border-t border-border/40 mt-12">
      {/* Global Resource Selector Tabs */}
      <div className="flex justify-center mb-16 px-4 sm:px-0">
        <div className="flex flex-col sm:inline-flex sm:flex-row w-full sm:w-auto bg-surface/40 p-1.5 rounded-2xl border border-border/60 backdrop-blur-xl relative gap-1.5 sm:gap-0">
          <button
            onClick={() => {
              setActiveLibrary("ux");
              setActiveStage("all");
              setSearchQuery("");
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-300 relative z-10 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
              activeLibrary === "ux" ? "text-background font-semibold" : "text-muted hover:text-foreground"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            📚 Prompt Library UX
            {activeLibrary === "ux" && (
              <motion.div
                layoutId="activeLibraryTab"
                className="absolute inset-0 bg-foreground rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveLibrary("vibe");
              setActiveStage("all");
              setSearchQuery("");
            }}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm font-medium transition-all duration-300 relative z-10 flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto ${
              activeLibrary === "vibe" ? "text-background font-semibold" : "text-muted hover:text-foreground"
            }`}
          >
            <Terminal className="w-4 h-4" />
            📚 Prompt Library — Vibe Coding
            {activeLibrary === "vibe" && (
              <motion.div
                layoutId="activeLibraryTab"
                className="absolute inset-0 bg-foreground rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Header Info (Contextual based on Active Library) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/20 pb-8">
        <AnimatePresence mode="wait">
          {activeLibrary === "ux" ? (
            <motion.div
              key="ux-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-left max-w-3xl"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3 border border-primary/20">
                <Award className="w-3.5 h-3.5" />
                40 Prompts de Diseño
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-4">
                📚 Prompt Library UX
              </h2>
              <p className="text-lg text-muted leading-relaxed font-light mb-2">
                40 prompts para todo el proceso de diseño de productos digitales.
              </p>
              <p className="text-sm text-muted/80 leading-relaxed">
                <strong>Cómo usarlos:</strong> copia el prompt, reemplaza el texto entre <span className="text-foreground">[corchetes]</span> con tu contexto, y pégalo en tu herramienta de IA. Mientras más contexto des, mejor el resultado.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="vibe-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-left max-w-3xl"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-3 border border-secondary/20">
                <Terminal className="w-3.5 h-3.5" />
                50 Prompts de Construcción
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight mb-4">
                📚 Prompt Library — Vibe Coding
              </h2>
              <p className="text-lg text-muted leading-relaxed font-light mb-2">
                50 prompts para construir prototipos conversando con IA.
              </p>
              <p className="text-sm text-muted/80 leading-relaxed">
                <strong>Cómo usarlos:</strong> copia el prompt, reemplaza el texto entre <span className="text-foreground">[corchetes]</span> con tu contexto, y pégalo en tu herramienta de IA. <strong className="text-foreground/90 font-medium">Regla de oro del vibe coding:</strong> pide una cosa a la vez y revisa antes de seguir.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Sidebar Filters & Search */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl sticky top-24 space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Buscar</h4>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Buscar prompt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border/60 focus:border-primary/80 focus:ring-1 focus:ring-primary/45 rounded-xl text-sm outline-none text-foreground transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Filtrar por etapa</h4>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  onClick={() => setActiveStage("all")}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border text-center flex items-center justify-center lg:justify-between flex-shrink-0 whitespace-nowrap ${activeStage === "all"
                    ? "bg-foreground text-background border-background shadow-sm font-semibold"
                    : "bg-background hover:bg-surface/80 text-muted border-background"
                    }`}
                >
                  <span>Todos los prompts</span>
                </button>
                {currentStages.map((stage) => {
                  const shortTitle = stage.title.split(" — ")[1] || stage.title;
                  return (
                    <button
                      key={stage.title}
                      onClick={() => setActiveStage(stage.title)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2.5 border text-left flex-shrink-0 whitespace-nowrap ${activeStage === stage.title
                        ? "bg-foreground text-background border-background shadow-sm font-semibold"
                        : "bg-background hover:bg-surface/80 text-muted border-background"
                        }`}
                    >
                      {getStageIcon(stage.icon)}
                      <span>{shortTitle}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prompts Grid */}
        <div className="lg:col-span-9">
          {totalFilteredCount > 0 ? (
            <div className="space-y-12">
              {filteredStages.map((stage) => (
                <div key={stage.title} className="space-y-6">
                  <h3 className="text-xl font-medium text-foreground border-b border-border/20 pb-2 flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center border border-border/40">
                      {getStageIcon(stage.icon)}
                    </span>
                    {stage.title}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {stage.prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="group bg-surface/40 hover:bg-surface/60 border border-border/40 hover:border-border transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between relative min-h-[260px] overflow-hidden"
                      >
                        <div>
                          <h4 className="text-base font-semibold text-muted mb-4 group-hover:text-primary transition-colors duration-200">
                            {prompt.title}
                          </h4>

                          <div className="relative mt-2">
                            {/* Blur effect if locked */}
                            <p className={`text-md text-foreground/60 font-light leading-relaxed select-none transition-all duration-500 ${!unlocked ? "blur-md select-none opacity-40" : ""
                              }`}>
                              {prompt.template}
                            </p>

                            {/* Lock Overlay */}
                            {!unlocked && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent pointer-events-none">
                                <span className="w-8 h-8 rounded-full bg-surface border border-border/80 flex items-center justify-center text-muted mb-2 shadow-sm animate-pulse">
                                  <Lock className="w-3.5 h-3.5" />
                                </span>
                                <span className="text-xs text-muted/80 text-center font-medium">Bloqueado</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border/20 flex justify-end">
                          <button
                            onClick={() => handleCopy(prompt.title, prompt.template, prompt.id)}
                            disabled={!unlocked}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${!unlocked
                              ? "bg-surface/30 border-border/20 text-muted/40 cursor-not-allowed"
                              : copiedId === prompt.id
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                                : "bg-surface hover:bg-surface-hover border-border/60 hover:border-border text-foreground cursor-pointer"
                              }`}
                          >
                            {copiedId === prompt.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 animate-scaleUp" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copiar Prompt
                              </>
                            )}
                          </button>
                        </div>

                        {/* Ambient light inside card on hover */}
                        {unlocked && (
                          <div className="absolute -right-10 -bottom-10 w-24 h-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface/20 rounded-3xl border border-border/40">
              <p className="text-muted text-base font-light">No se encontraron prompts que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
