"use client";

import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 text-center relative overflow-hidden py-16">
      {/* Decorative Blur Background Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-tr from-[#0ea5e9]/20 to-[#8b5cf6]/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0" />

      <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
        
        {/* Animated Big 404 Label */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative mb-2"
        >
          <span className="text-[clamp(5rem,15vw,9rem)] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#0ea5e9] to-[#8b5cf6]">
            {t("title")}
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-2xl md:text-3xl font-light text-foreground mb-4 tracking-tight"
        >
          {t("subtitle")}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base text-muted leading-relaxed max-w-md mb-10 font-light"
        >
          {t("description")}
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium text-sm transition-all duration-200 hover:scale-105 shadow-md shadow-[#0ea5e9]/20 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t("goHome")}
          </Link>
          
          <Link
            href="/case-studies"
            className="px-6 py-3 rounded-full bg-surface text-foreground font-medium text-sm hover:scale-105 transition-all duration-200 shadow-md shadow-border/50 border border-border flex items-center justify-center gap-2"
          >
            {t("viewProjects")}
            <ArrowRight className="w-4 h-4 text-[#0ea5e9]" />
          </Link>
        </motion.div>
        
      </div>
    </main>
  );
}
