"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
  const t = useTranslations('Hero');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const titles = t.raw('titles') as { line1: string; line2: string }[];

  useEffect(() => {
    if (!titles || titles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [titles]);

  const currentTitle = titles?.[currentIndex] || { line1: "", line2: "" };

  return (
    <section className="dark bg-background text-foreground relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden text-center py-20">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/* Immediate gradient placeholder so the section is never blank while the video loads */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
          aria-hidden
        />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          className={`w-full h-full object-cover blur-3xl scale-110 transition-opacity duration-1000 ease-out ${videoReady ? "opacity-40" : "opacity-0"}`}
          style={{ transform: "translate3d(0, 0, 0) scale(1.1)" }} // Force GPU acceleration for better blur performance
        >
          <source src="/movie/background.mp4" type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability against the video */}
        <div className="absolute inset-0 bg-background/30" />
        {/* Bottom fade gradient to blend smoothly into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center w-full">
        <div className="h-[140px] md:h-[180px] flex items-center justify-center mb-6 relative w-full">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground leading-tight absolute w-full text-center"
            >
              {currentTitle.line1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {currentTitle.line2}
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <p className="text-lg md:text-xl text-muted max-w-4xl mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="/case-studies"
            className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-foreground/20 dark:shadow-foreground/5"
          >
            {t('viewProjects')}
          </a>
          <a
            href="https://www.linkedin.com/in/fcophox/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-surface text-foreground font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-border/50 border border-border"
          >
            {t('visitLinkedin')}
          </a>
        </div>
      </div>
    </section>
  );
}
