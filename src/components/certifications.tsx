"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Category = "Todos" | "Certificaciones" | "Diplomados" | "Cursos & Bootcamps";

const certifications = [
  {
    title: "Programa Avanzado en CRO, UX & Analytics",
    year: "2021",
    institution: "Unir",
    category: "Certificaciones",
    logo: "/studies/Unir.svg",
  },
  {
    title: "Certificación UX-PM (3 niveles)",
    year: "2018",
    institution: "Ayer Viernes – UX Alliance",
    category: "Certificaciones",
    logo: "/studies/UXAlliance.svg",
  },
  {
    title: "Diplomado en Data-Driven Design",
    year: "2022",
    institution: "Universidad del Desarrollo",
    category: "Diplomados",
    logo: "/studies/UDD.svg",
  },
  {
    title: "Diplomado en ResearchOps",
    year: "2020",
    institution: "Aprende UX",
    category: "Diplomados",
    logo: "/studies/AprendeUX.svg",
  },
  {
    title: "Diplomado en Discovery UX",
    year: "2020",
    institution: "Aprende UX",
    category: "Diplomados",
    logo: "/studies/AprendeUX.svg",
  },
  {
    title: "Diplomado en UX Design",
    year: "2019",
    institution: "Universidad Finis Terrae",
    category: "Diplomados",
    logo: "/studies/Finisterrae.svg",
  },
  {
    title: "Diplomado en Gestión y Desarrollo de Proyectos Digitales",
    year: "2014",
    institution: "Pontificia Universidad Católica",
    category: "Diplomados",
    logo: "/studies/Puc.svg",
  },
  {
    title: "Diseño Gráfico",
    year: "2007",
    institution: "Duoc UC",
    category: "Certificaciones",
    logo: "/studies/DuocUC.svg",
  },
  {
    title: "Product Discovery",
    year: "2022",
    institution: "EDTeam",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Product Manager",
    year: "2022",
    institution: "EDTeam",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Accesibilidad Web",
    year: "2021",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Creación y gestión de Design Systems",
    year: "2021",
    institution: "Domestika",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Agile y Scrum",
    year: "2021",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Bootcamp Service Design",
    year: "2021",
    institution: "MEDU Escuela de Innovación",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Machine Learning en Contexto UX",
    year: "2020",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
    logo: "/studies/AprendeUX.svg",
  },
  {
    title: "Arquitectura de la Información",
    year: "2019",
    institution: "Universidad de Chile",
    category: "Cursos & Bootcamps",
  },
];

export function CertificationsSection() {
  const [activeTab, setActiveTab] = useState<Category>("Todos");
  const t = useTranslations('CertificationsSection');

  const tabs: Category[] = [
    "Todos",
    "Certificaciones",
    "Diplomados",
    "Cursos & Bootcamps",
  ];

  const filteredItems =
    activeTab === "Todos"
      ? certifications
      : certifications.filter((item) => item.category === activeTab);

  return (
    <section className="dark bg-background w-full mt-32 mb-16 p-8 md:p-16 rounded-[2.5rem] shadow-xl">
      <div className="flex flex-col mb-10">
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-8">
          {t('title')}
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-6 border-b border-border/20">
          {tabs.map((tab) => {
            let translatedTab = "";
            switch (tab) {
              case "Todos": translatedTab = t('catAll'); break;
              case "Certificaciones": translatedTab = t('catCertifications'); break;
              case "Diplomados": translatedTab = t('catDiplomas'); break;
              case "Cursos & Bootcamps": translatedTab = t('catCourses'); break;
            }

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === tab
                  ? "text-foreground"
                  : "text-muted hover:text-foreground/80"
                  }`}
              >
                {tab === "Todos" ? t('showAll') : translatedTab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="cert-tab-indicator"
                    className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Masonry Layout */}
      <motion.div layout className="columns-1 md:columns-2 lg:columns-3 xl:columns-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex flex-col p-6 rounded-3xl bg-surface border-none hover:bg-surface/80 transition-colors mb-4 break-inside-avoid ${item.logo ? 'min-h-[220px]' : 'h-fit'}`}
            >
              {/* Logo Area */}
              {item.logo && (
                <div className="w-32 h-12 mb-6 flex items-center relative">
                  <Image
                    src={item.logo}
                    alt={item.institution}
                    fill
                    className="object-contain object-left"
                  />
                </div>
              )}

              {/* Content */}
              <div className="mt-auto flex flex-col gap-4">
                <h3 className="text-[1.1rem] font-medium text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-muted font-mono uppercase tracking-wider">
                  {item.year} — {item.institution}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
