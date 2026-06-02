"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

import { CertificationsSection } from "@/components/certifications";
import { MethodologySchema } from "@/components/methodology-schema";
import { Banner } from "@/components/banner";
import { useTranslations } from "next-intl";

export default function MethodologyPage() {
  const t = useTranslations('MethodologyPage');

  return (
    <main className="w-full overflow-x-hidden flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Top Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backHome')}
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-6xl"
        >
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 3 Images Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          {/* Image 1 */}
          <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden bg-surface relative group">
            <img
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
              alt="Retro computer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Image 2 */}
          <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden bg-surface relative group">
            <img
              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80"
              alt="Sketching wireframes"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Image 3 */}
          <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden bg-surface relative group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Team working"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        </motion.div>

        {/* Intro Text Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-24 mb-24">
          {/* Left Column (Download CV) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 flex lg:items-end"
          >
            <span
              className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-border/40 bg-surface/50 text-muted opacity-50 cursor-not-allowed text-sm font-medium w-fit select-none"
            >
              <Download size={16} />
              {t('downloadCv')}
            </span>
          </motion.div>

          {/* Right Column (Text) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-[1.5] flex flex-col gap-8"
          >
            <h2 className="text-3xl md:text-[2.5rem] font-light text-foreground leading-[1.2] tracking-tight">
              {t('methodTitle')}
            </h2>
            <div className="flex flex-col gap-6 text-muted text-base md:text-lg leading-relaxed font-light">
              <p>
                {t('methodP1')}
              </p>
              <p>
                {t('methodP2')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Methodology Schema */}
        <MethodologySchema />

        {/* Certifications Section */}
        <CertificationsSection />
        
        {/* Banner */}
        <Banner />
      </div>
    </main>
  );
}
