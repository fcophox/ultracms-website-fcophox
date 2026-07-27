"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface Slide {
  label: string;
  title: string;
  description: string;
  cta: string;
  form: string;
}

export function Banner() {
  const t = useTranslations('Banner');
  const slides = (t.raw('slides') || []) as Slide[];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (slides.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % slides.length);
          return 0;
        }
        return prev + 2; // Ticks every 100ms. 50 ticks * 2 = 100% (5 seconds)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isHovered, slides.length]);

  if (!slides || slides.length === 0) return null;

  const handleTabClick = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const activeSlide = slides[currentIndex];

  return (
    <section className="dark w-full py-24 z-10 relative">
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="max-w-6xl mx-auto px-6"
      >
        {/* The Card */}
        <div className="bg-background relative w-full flex flex-col items-start text-left rounded-3xl overflow-hidden border border-border px-8 md:px-16 py-12 md:py-16 shadow-2xl min-h-[380px] justify-center">
          {/* Progress Line at the very top of the Card */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-border/20 overflow-hidden z-20">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{
                width: `${progress}%`,
                transition: progress === 0 ? "none" : "width 100ms linear"
              }}
            />
          </div>

          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            {/* Immediate gradient placeholder so the section is never blank while the video loads */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"
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
              className={`w-full h-full object-cover blur-2xl transition-opacity duration-1000 ease-out ${videoReady ? "opacity-30" : "opacity-0"}`}
              style={{ transform: "translate3d(0, 0, 0) scale(1.1)" }}
            >
              <source src="/movie/background.mp4" type="video/mp4" />
            </video>
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-background/50" />
          </div>

          {/* Content Slider */}
          <div className="relative z-10 flex flex-col items-start w-full flex-grow justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col items-start w-full text-left"
              >
                {/* Dynamic Category Badge inside motion.div */}
                <div className="mb-6">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                    {activeSlide.label}
                  </span>
                </div>

                <h2 className="text-[clamp(1.5rem,5vw,2.75rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[800px] mb-4">
                  {activeSlide.title}
                </h2>
                <p className="text-base md:text-lg text-muted leading-relaxed mb-8 max-w-2xl text-left">
                  {activeSlide.description}
                </p>
                <a
                  href={`/contact?form=${activeSlide.form}`}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-200 shadow-xl shadow-foreground/10 group/btn"
                >
                  {activeSlide.cta}
                  <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2.5 mt-6">
          {slides.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => handleTabClick(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary w-5"
                    : "bg-border/60 hover:bg-primary/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
