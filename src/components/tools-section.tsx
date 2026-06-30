"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RevealImage } from "./reveal-image";
import { useTranslations } from "next-intl";

export function ToolsSection() {
  const t = useTranslations('Tools');

  return (
    <section className="w-full px-6 py-24 z-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Copy & Call-to-action */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start"
          >
            <span className="inline-block bg-secondary/10 text-secondary border border-secondary/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6">
              {t('badge')}
            </span>
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-light text-foreground leading-tight tracking-tight mb-6">
              {t('title')}
            </h2>
            <p className="text-muted text-base md:text-lg font-light leading-relaxed mb-8">
              {t('description')}
            </p>
            <a
              href="https://kosei.fcophox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 group"
            >
              {t('button')}
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          {/* Right Column: Premium Tool Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <a
              href="https://kosei.fcophox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-3xl border border-border/40 bg-surface/50 hover:bg-surface overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-xl hover:shadow-2xl cursor-none"
              data-custom-cursor="true"
            >
              <div className="relative w-full aspect-[16/10] bg-surface">
                <RevealImage
                  src="/brand/kosei_preview.png"
                  alt="Kōsei Preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs text-muted">2026</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-3.5 py-1 rounded-full ml-auto">
                    {t('cardBadge')}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-light text-foreground leading-tight mb-3 transition-colors group-hover:text-primary">
                  {t('cardTitle')}
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {t('cardDesc')}
                </p>
              </div>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
