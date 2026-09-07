"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { GradientField } from "@/components/gradient-field";

import { ArrowRight } from "lucide-react";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

export function Hero() {
  const t = useTranslations('Hero');
  const shouldReduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);

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
      {/*
        Background. This replaced a looping <video> drawn through blur-3xl —
        a 64px gaussian over the whole viewport recomputed every frame, on top
        of a continuous h264 decode. The 248 KB the file weighed was never the
        problem; that filter was. A shader paints the softness instead of
        post-processing it, so the expensive pass stops existing rather than
        being swapped for another one.

        The scrim and the bottom fade that used to sit here are gone too: the
        field carries its own vignette and dissolves into the page colour in the
        shader, which is two fewer full-viewport surfaces to composite.
      */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {/*
          One viewport tall, pinned to the top — not the section's full height.
          `min-h-screen` is a minimum: when the copy is taller than the screen
          the section grows, the canvas grows with it, and the shader reframes,
          because it normalises its coordinates by the canvas aspect ratio. That
          is why the hero stopped matching /hero-lab, whose main box is exactly
          one viewport. Fixing the canvas to h-screen makes the two identical,
          and caps the shader's cost at one screenful however tall the hero gets.

          Nothing shows below it: the field has already dissolved into the page
          colour by then, so it meets plain background with no seam.
        */}
        <div className="absolute inset-x-0 top-0 h-screen overflow-hidden">
          {/* Paints instantly, and stays as the fallback wherever WebGL is unavailable. */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20"
            aria-hidden
          />
          {/*
            `absolute` is load-bearing, not cosmetic. The canvas is static by
            default, and CSS paints positioned elements above non-positioned
            ones whatever the DOM order — so the gradient above, which is
            absolute, was covering the field entirely. Positioning the canvas
            too puts them in the same painting phase, where source order wins
            and the canvas lands on top. The gradient stays underneath doing its
            real job: showing through only when WebGL never starts.
          */}
          <GradientField className="absolute inset-0" />
        </div>
      </div>

      <div className="relative z-10 dm-container-hero flex flex-col items-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          className="relative mb-5"
        >
          {/* Soft halo so the photo sits on the field instead of floating on it */}
          <div
            className="absolute -inset-3 rounded-full bg-primary/15 blur-xl"
            aria-hidden
          />
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-1 ring-border/60 shadow-lg shadow-background/40">
            <Image
              src="/brand/francisco-avatar.png?v=2"
              alt="Francisco Hormazábal"
              fill
              sizes="80px"
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/80 bg-surface/30 backdrop-blur-md text-xs font-mono tracking-wide text-foreground/80 mb-6 hover:border-primary/30 transition-colors duration-300 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span>{t('badge')}</span>
        </motion.div>

        <div className="h-[140px] md:h-[180px] flex items-center justify-center mb-6 relative w-full">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight text-foreground leading-tight absolute w-full text-center"
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
            className="px-8 py-3 rounded-full bg-primary text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            {t('viewProjects')}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/fcophox/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-surface text-foreground font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-border/50 border border-border flex items-center justify-center gap-2"
          >
            <LinkedinIcon className="w-4 h-4 text-white" />
            {t('visitLinkedin')}
          </a>
        </div>
      </div>
    </section>
  );
}
