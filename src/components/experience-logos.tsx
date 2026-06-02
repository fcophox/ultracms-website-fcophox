"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const logos = [
  { name: "AprendeUX", path: "/studies/AprendeUX.svg" },
  { name: "AyerViernes", path: "/studies/Ayerviernes.svg" },
  { name: "Coursera", path: "/studies/Coursera.svg" },
  { name: "DuocUC", path: "/studies/DuocUC.svg" },
  { name: "FinisTerrae", path: "/studies/Finisterrae.svg" },
  { name: "Google", path: "/studies/Google.svg" },
  { name: "Microsoft", path: "/studies/Microsoft.svg" },
  { name: "PUC", path: "/studies/Puc.svg" },
  { name: "UDD", path: "/studies/UDD.svg" },
  { name: "UXAlliance", path: "/studies/UXAlliance.svg" },
  { name: "UNIR", path: "/studies/Unir.svg" }
];

export function ExperienceLogos() {
  const t = useTranslations('ExperienceLogos');

  return (
    <section className="dark text-foreground w-full relative z-10 bg-background overflow-hidden py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px]">
            {t('title')}
          </h2>
        </motion.div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-y-16 items-center mb-16">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-start opacity-50 hover:opacity-100 transition-opacity"
            >
              <div className="relative w-32 h-12">
                <Image 
                  src={logo.path} 
                  alt={logo.name} 
                  fill 
                  className="object-contain object-left" 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link 
            href="/methodology" 
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
          >
            {t('viewStudies')} <ArrowUpRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
