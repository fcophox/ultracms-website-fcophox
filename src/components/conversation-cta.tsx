"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { ParticleWave } from "@/components/particle-wave";

interface Slide {
  label: string;
  title: string;
  description: string;
  cta: string;
  form: string;
}

/** Strong ease-out; the built-in curves feel weak at this scale. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const SLIDE_MS = 5000;

export function ConversationCta() {
  const t = useTranslations("Banner");
  const shouldReduceMotion = useReducedMotion();

  const slides = (t.raw("slides") || []) as Slide[];

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "-10%" });

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Only rotate while the section is on screen. Otherwise the carousel runs
  // through its messages while nobody is looking, and whoever scrolls down
  // arrives mid-cycle at whatever slide happened to be up.
  //
  // `index` is a dependency so tapping a dot restarts the dwell instead of
  // leaving the next slide to arrive on the old schedule.
  useEffect(() => {
    if (slides.length <= 1 || isHovered || !inView) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [index, isHovered, inView, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  const rise = (delay: number) => ({
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15%" },
    transition: { duration: 0.55, delay, ease: EASE_OUT },
  });

  const swap = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 },
    transition: { duration: 0.4, ease: EASE_OUT },
  };

  return (
    <section
      ref={sectionRef}
      className="dark relative w-full overflow-hidden bg-background py-28 md:py-36"
      /*
        The class already resolves to the page background, but only once the
        stylesheet is applied — before that the section paints as nothing and
        flashes white until the mesh appears. An inline background paints in
        that first frame, with no stylesheet needed.

        The custom property still wins in normal operation, so a palette change
        in DESIGN.MD carries; the literal only covers the instant before CSS
        lands, and matches --background in .dark.
      */
      style={{ backgroundColor: "var(--background, #101012)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The mesh is the only background this section gets — no card, no panel. */}
      <div className="absolute inset-0" aria-hidden>
        <ParticleWave />
      </div>

      <div className="dm-container relative z-10 flex flex-col items-center text-center">
        {/*
          The three messages are different lengths, and with no card to sit in
          there is nothing to hold the height. Every slide is stacked invisibly
          in one grid cell so the box is always as tall as the longest, and the
          button and dots below it never jump as the copy rotates.
        */}
        <div className="relative w-full">
          {/*
            Plain divs, never h2/p: this block exists only to occupy space, and
            real heading tags here would put four <h2> into the document outline.
          */}
          <div aria-hidden className="grid invisible">
            {slides.map((s, i) => (
              <div key={i} className="[grid-area:1/1] flex flex-col items-center">
                <div className="mb-8 font-mono text-[10px] uppercase tracking-[0.18em] md:text-xs">
                  {s.label}
                </div>
                <div className="mb-6 max-w-3xl text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
                  {s.title}
                </div>
                <div className="mb-10 max-w-xl text-base leading-relaxed md:text-lg">
                  {s.description}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                {...swap}
                className="flex flex-col items-center"
              >
                <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.18em] text-primary md:text-xs">
                  {slide.label}
                </p>
                <h2 className="mb-6 max-w-3xl text-4xl font-normal leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                <p className="mb-10 max-w-xl text-base leading-relaxed text-muted md:text-lg">
                  {slide.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div {...rise(0.16)}>
          <Link
            href={`/contact?form=${slide.form}`}
            className="group/cta inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 font-medium text-background shadow-lg shadow-primary/25 transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
          >
            {slide.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
          </Link>
        </motion.div>

        {/*
          The progress lives inside the active dot rather than as a separate
          bar. That is already where the eye goes to answer "which of the three
          is this", so duration and position share one control and neither has
          to compete for attention. A rule floating across a section with no
          card would have nothing to belong to.

          A CSS animation, not a state tick: the old banner re-rendered every
          100ms to widen a div. This runs off the main thread, and pausing is
          one property — which matters because the fill has to stop exactly
          when the rotation does, on hover and off screen, or the two drift
          apart and the bar starts lying.
        */}
        <style>{`
          @keyframes conversation-progress {
            from { transform: scaleX(0); }
            to   { transform: scaleX(1); }
          }
        `}</style>

        <motion.div {...rise(0.22)} className="mt-8 flex items-center justify-center gap-2.5">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={s.title}
              aria-current={i === index}
              className={`relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-border/40" : "w-2 bg-border/60 hover:bg-primary/50"
              }`}
            >
              {i === index && (
                <span
                  // Remounting on each slide is what restarts the fill.
                  key={index}
                  aria-hidden
                  className="absolute inset-0 origin-left rounded-full bg-primary"
                  style={{
                    animation: `conversation-progress ${SLIDE_MS}ms linear forwards`,
                    animationPlayState: isHovered || !inView ? "paused" : "running",
                  }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
