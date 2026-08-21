"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandMetal, ThumbsUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface ArticleFeedbackProps {
  /** Slug del contenido en Kontorōru: la reacción es del contenido, no de la fila. */
  slug: string;
}

export function ArticleFeedback({ slug }: ArticleFeedbackProps) {
  const t = useTranslations("ArticleFeedback");
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const storageKey = `liked_kontororu_${slug}`;

  useEffect(() => {
    // Check if user already liked this article in this browser
    if (typeof window !== "undefined") {
      const liked = localStorage.getItem(storageKey);
      if (liked) {
        setHasLiked(true);
      }
    }
  }, [storageKey]);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    
    setIsLiking(true);
    
    // Optimistic Update: Immediately show the user that their like was registered
    setHasLiked(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }

    /*
     * La llamada sale del navegador, no de nuestro servidor: es el único
     * endpoint del CMS sin clave y su cupo es de 60/min POR IP. Proxiándolo,
     * todo el tráfico del sitio compartiría una IP y agotaría el cupo entre
     * todos los lectores.
     */
    try {
      const base = process.env.NEXT_PUBLIC_KONTORORU_URL;
      const tenant = process.env.NEXT_PUBLIC_KONTORORU_TENANT;

      if (!base || !tenant) {
        console.error("Faltan NEXT_PUBLIC_KONTORORU_URL o NEXT_PUBLIC_KONTORORU_TENANT.");
        return;
      }

      const res = await fetch(`${base.replace(/\/$/, "")}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant, slug, reaction: "like" }),
      });

      if (!res.ok) {
        console.error("No se pudo registrar la reacción. Se mantiene el estado local.");
      }
    } catch (error) {
      console.error("Error al registrar la reacción:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="w-full mt-24 pt-16 border-t border-border flex flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {!hasLiked ? (
          <motion.div
            key="unliked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-5"
          >
            <h3 className="text-2xl font-medium text-foreground">{t("question")}</h3>
            <p className="text-muted text-lg max-w-md">{t("invitation")}</p>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="mt-4 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-surface border border-border text-foreground font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition-all disabled:opacity-50 group shadow-sm hover:shadow-md hover:shadow-primary/20"
            >
              <ThumbsUp className={`w-5 h-5 ${isLiking ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'}`} />
              {isLiking ? t("saving") : t("like")}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="liked"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
              <HandMetal className="w-10 h-10 stroke-primary stroke-2" />
            </div>
            <h3 className="text-3xl font-medium text-foreground">{t("thanksTitle")}</h3>
            <p className="text-muted text-lg">{t("thanksSubtitle")}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
