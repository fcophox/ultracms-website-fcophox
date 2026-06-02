"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandMetal, ThumbsUp } from "lucide-react";

interface ArticleFeedbackProps {
  itemId: string;
  tableName: "articles" | "case_studies";
}

export function ArticleFeedback({ itemId, tableName }: ArticleFeedbackProps) {
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const storageKey = `liked_${tableName}_${itemId}`;

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

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: itemId, tableName }),
      });

      if (!res.ok) {
        console.error("Failed to update like count on server. Continuing with local state.");
      }
    } catch (error) {
      console.error("Error liking article:", error);
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
            <h3 className="text-2xl font-medium text-foreground">¿Te resultó interesante este contenido?</h3>
            <p className="text-muted text-lg max-w-md">Si este artículo te aportó valor, házmelo saber con un me gusta. Me ayuda a crear mejor contenido.</p>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="mt-4 flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-surface border border-border text-foreground font-medium hover:bg-primary/10 hover:border-primary hover:text-primary transition-all disabled:opacity-50 group shadow-sm hover:shadow-md hover:shadow-primary/20"
            >
              <ThumbsUp className={`w-5 h-5 ${isLiking ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'}`} />
              {isLiking ? 'Guardando...' : 'Sí, me pareció útil'}
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
            <h3 className="text-3xl font-medium text-foreground">¡Gracias por tu feedback!</h3>
            <p className="text-muted text-lg">Me alegra saber que te ha sido de utilidad.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
