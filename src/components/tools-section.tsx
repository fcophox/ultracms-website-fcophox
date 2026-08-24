"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RevealImage } from "./reveal-image";
import { useTranslations } from "next-intl";

export function ToolsSection() {
  const t = useTranslations('Tools');

  return (
    <section className="dark w-full py-24 lg:py-32 z-10 relative flex items-center min-h-[70vh] bg-surface/20 overflow-hidden text-foreground">
      {/* Desktop & Mobile Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/tanzo/bg-tanzo.png"
        className="absolute inset-0 w-full h-full object-cover object-center md:object-right opacity-90 z-0 pointer-events-none"
      >
        <source src="/tanzo/bg-tanzo.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-background via-background/100 to-transparent lg:w-2/3 pointer-events-none"></div>
      <div className="absolute inset-x-0 top-0 h-32 md:h-48 z-0 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-32 md:h-48 z-0 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Copy & Call-to-action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start w-[85%] lg:w-full relative z-10"
          >
            <span className="inline-block bg-[#dfb281]/10 text-[#dfb281] border border-[#dfb281]/20 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wide uppercase mb-6">
              {t('badge')}
            </span>
            <h2
              className="text-[clamp(1.8rem,4vw,2.5rem)] font-normal text-foreground leading-tight tracking-tight mb-6"
              dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            />
            <p className="text-muted text-base md:text-lg font-medium leading-relaxed mb-8">
              {t('description')}
            </p>
            <a
              href="https://tanzo.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 group"
            >
              {t('button')}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* Right Column: Tanzo Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 lg:static lg:translate-y-0 lg:col-span-7 flex justify-center lg:justify-end items-center min-h-[300px] pointer-events-none lg:pointer-events-auto z-10"
          >
          </motion.div>
        </div>
      </div>
    </section>
  );
}
