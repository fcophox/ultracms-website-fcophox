"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function UxBento() {
  const t = useTranslations('UxBento');

  return (
    <section className="w-full relative z-10 bg-background overflow-visible py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left Column (Spans 2 columns) */}
          <div className="md:col-span-2 flex flex-col gap-6">

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-2"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold tracking-wider text-muted uppercase">
                  {t('headerLabel')}
                </span>
              </div>
              <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px]">
                {t('headerTitle')}
              </h2>
            </motion.div>

            {/* Nested Grid: 2 Square Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* Square Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-surface border-none p-8 flex flex-col justify-between aspect-square group hover:bg-foreground/5 dark:hover:bg-[#1A1A1E] transition-colors"
              >
                <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
                  <Image src="/methodology/bg-card-1.svg" alt="Background" fill className="object-cover" />
                </div>
                <h3
                  className="relative z-10 text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-4"
                  dangerouslySetInnerHTML={{ __html: t('card1Title') }}
                />
                <p className="relative z-10 text-md text-muted">
                  {t('card1Desc')}
                </p>
              </motion.div>

              {/* Square Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-3xl bg-surface border-none p-8 flex flex-col justify-between aspect-square group hover:bg-foreground/5 dark:hover:bg-[#1A1A1E] transition-colors"
              >
                <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
                  <Image src="/methodology/bg-card-3.svg" alt="Background" fill className="object-cover" />
                </div>
                <h3
                  className="relative z-10 text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-4"
                  dangerouslySetInnerHTML={{ __html: t('card2Title') }}
                />
                <p className="relative z-10 text-md text-muted">
                  {t('card2Desc')}
                </p>
              </motion.div>

            </div>

            {/* Wide Rectangular Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-surface border-none p-8 md:p-10 relative overflow-hidden flex flex-col justify-end min-h-[300px] group hover:bg-foreground/5 dark:hover:bg-[#1A1A1E] transition-colors"
            >
              <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
                <Image src="/methodology/bg-card-1.svg" alt="Background" fill className="object-cover" />
              </div>
              {/* Abstract fluid background effect representing the flower */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-surface/10 to-transparent opacity-60 blur-2xl group-hover:opacity-80 transition-opacity duration-700 pointer-events-none z-0" />

              <div className="relative z-10 max-w-md mt-auto pt-24">
                <h3
                  className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-3"
                  dangerouslySetInnerHTML={{ __html: t('card3Title') }}
                />
                <p className="text-md text-muted">
                  {t('card3Desc')}
                </p>
              </div>
            </motion.div>

          </div>

          {/* Right Column (Spans 1 column, Tall) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-1 rounded-3xl bg-surface border-none relative overflow-hidden flex flex-col min-h-[500px] group hover:bg-foreground/5 dark:hover:bg-[#1A1A1E] transition-colors"
          >
            <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
              <Image src="/methodology/bg-card-3.svg" alt="Background" fill className="object-cover" />
            </div>
            {/* Background gradient/image simulation */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-primary/10 opacity-80 z-0" />

            {/* Content overlay */}
            <div className="relative z-10 p-8 flex flex-col h-full">
              {/* <Link href="#" className="w-10 h-10 rounded-full bg-foreground/10 dark:bg-[#1A1A1E] border-none flex items-center justify-center text-foreground hover:bg-foreground hover:text-background transition-colors self-start mb-auto">
                <ArrowUpRight size={18} />
              </Link> */}

              <div className="mt-auto">
                <h3
                  className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-2"
                  dangerouslySetInnerHTML={{ __html: t('card4Title') }}
                />
                <p className="text-md text-muted">
                  {t('card4Desc')}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
