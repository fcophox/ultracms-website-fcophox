"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResourcesHero } from "./resources-hero";
import { PromptLibrary } from "./prompt-library";

export function ResourcesPageContent() {
  const [unlocked, setUnlocked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setUnlocked(localStorage.getItem("resources_unlocked") === "true");
    }

    const handleUnlock = () => {
      setUnlocked(true);
    };

    window.addEventListener("resources-unlock", handleUnlock);
    return () => {
      window.removeEventListener("resources-unlock", handleUnlock);
    };
  }, []);

  if (!mounted) {
    // Return placeholder to match SSR structure to prevent hydration error
    return (
      <div className="w-full flex-1">
        <ResourcesHero onUnlock={() => setUnlocked(true)} />
      </div>
    );
  }

  return (
    <div className="w-full flex-1">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ResourcesHero onUnlock={() => setUnlocked(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="library"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PromptLibrary />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
