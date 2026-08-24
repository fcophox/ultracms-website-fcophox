"use client";

import { motion } from "framer-motion";
import { EvolutionTimeline } from "@/components/evolution-timeline";
import { AreasColaboracion } from "@/components/areas-colaboracion";
import { CertificationsSection } from "@/components/certifications";
import Link from "next/link";
import Image from "next/image";
import { RevealImage } from "@/components/reveal-image";
import { ArrowLeft, Download } from "lucide-react";
import { useTranslations } from "next-intl";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
);

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32">
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
          <h1 className="text-4xl md:text-[3.5rem] font-normal text-foreground mb-8 leading-tight tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-normal">
            {t('subtitle')}
          </p>
        </motion.div>


      </div>

      {/* Biography Section */}
      <div className="dark w-full py-2 mb-4 md:mb-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
          {/* Portrait Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full lg:w-[400px] shrink-0"
          >
            <div className="group relative aspect-[9/16] rounded-2xl overflow-hidden">
              <Image
                src="/about/fcophox-about.png"
                alt="Francisco Hormazábal"
                fill
                className="object-cover grayscale transition-[filter] duration-700 ease-out group-hover:grayscale-0"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center text-center">
                <p className="text-white font-medium text-sm drop-shadow-md">
                  {t('imageHoverText')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex-1 flex flex-col justify-center"
          >
            <h2 className="text-md md:text-lg font-light text-foreground mb-8">
              {t('bioGreeting1')}
              <a href="https://www.linkedin.com/in/fcophox/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold italic underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors">Francisco Hormazábal</a>
              {t('bioGreeting2')}
              <a href="https://github.com/fcophox" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold italic underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-colors">@fcophox</a>
              {t('bioGreeting3')}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Image src="/about/uxpm.svg" alt="UX-PM Badge" width={80} height={80} className="w-full h-full object-contain p-1" />
              </div>
              <p className="text-md md:text-lg text-primary font-medium leading-snug">
                {t('bioBadge')}
              </p>
            </div>

            <div className="space-y-6 text-lg text-muted">
              <p className="text-foreground font-medium">
                {t('bioP1')}
              </p>
              <p>
                {t.rich('bioP2', {
                  b: (chunks) => <strong className="font-semibold">{chunks}</strong>
                })}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-12">
              <a
                href="https://www.linkedin.com/in/fcophox/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                <LinkedinIcon className="w-5 h-5 mr-2" />
                {t('linkedin')}
              </a>
              <Link
                href="/cv"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#27272A] text-white font-medium hover:bg-[#27272A]/80 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Ver CV
              </Link>
            </div>
          </motion.div>
        </div>
      </div>


      <EvolutionTimeline />
      <AreasColaboracion />

      {/* Certifications Section */}
      <CertificationsSection />
    </main>
  );
}
