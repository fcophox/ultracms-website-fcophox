"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Category = "Todos" | "Certificaciones" | "Diplomados" | "Cursos & Bootcamps";

const certifications = [
  {
    title: "Diplomado en Data-Driven Design",
    year: "2022",
    institution: "Universidad del Desarrollo",
    category: "Diplomados",
    logo: "/studies/udd.svg",
  },
  {
    title: "Product Manager",
    year: "2022",
    institution: "EDTeam",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Certificación UX-PM (3 niveles)",
    year: "2018",
    institution: "Ayer Viernes – UX Alliance",
    category: "Certificaciones",
    logo: "/studies/uxalliance.svg",
  },
  {
    title: "Accesibilidad Web",
    year: "2021",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Diplomado en ResearchOps",
    year: "2020",
    institution: "Aprende UX",
    category: "Diplomados",
    logo: "/studies/aprendeux.svg",
  },
  {
    title: "Agile y Scrum",
    year: "2021",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Diplomado en UX Design",
    year: "2019",
    institution: "Universidad Finis Terrae",
    category: "Diplomados",
    logo: "/studies/uft.svg",
  },
  {
    title: "Product Discovery",
    year: "2022",
    institution: "EDTeam",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Diseño Gráfico",
    year: "2007",
    institution: "Duoc UC",
    category: "Certificaciones",
    logo: "/studies/duoc.svg",
  },
  {
    title: "Creación y gestión de Design Systems",
    year: "2021",
    institution: "Domestika",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Programa Avanzado en CRO, UX & Analytics",
    year: "2021",
    institution: "Unir",
    category: "Certificaciones",
    logo: "/studies/unir.svg",
  },
  {
    title: "Bootcamp Service Design",
    year: "2021",
    institution: "MEDU Escuela de Innovación",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Diplomado en Discovery UX",
    year: "2020",
    institution: "Aprende UX",
    category: "Diplomados",
    logo: "/studies/aprendeux.svg",
  },
  {
    title: "Arquitectura de la Información",
    year: "2019",
    institution: "Universidad de Chile",
    category: "Cursos & Bootcamps",
  },
  {
    title: "Diplomado en Gestión y Desarrollo de Proyectos Digitales",
    year: "2014",
    institution: "Pontificia Universidad Católica",
    category: "Diplomados",
    logo: "/studies/uc.svg",
  },
  {
    title: "Machine Learning en Contexto UX",
    year: "2020",
    institution: "Aprende UX",
    category: "Cursos & Bootcamps",
    logo: "/studies/aprendeux.svg",
  },
];

const getCategoryLabel = (category: string) => {
  if (category === "Certificaciones") return "Certificación";
  if (category === "Diplomados") return "Diplomado";
  return "Curso / Bootcamp";
};

const getCardClassName = (item: typeof certifications[0], index: number) => {
  const base = "flex flex-col p-6 rounded-3xl bg-surface border-none hover:bg-surface/80 transition-colors mb-4 break-inside-avoid w-full";
  
  if (item.logo) {
    const heights = [
      "min-h-[220px] md:min-h-[230px]",
      "min-h-[260px] md:min-h-[275px]",
      "min-h-[240px] md:min-h-[250px]",
      "min-h-[280px] md:min-h-[295px]"
    ];
    const offsets = ["", "md:mt-4", "", "md:mt-2"];
    const height = heights[index % heights.length];
    const offset = offsets[index % offsets.length];
    return `${base} ${height} ${offset}`;
  } else {
    const heights = [
      "min-h-[145px] md:min-h-[155px]",
      "min-h-[175px] md:min-h-[190px]",
      "min-h-[160px] md:min-h-[170px]",
      "min-h-[190px] md:min-h-[205px]"
    ];
    const offsets = ["", "", "md:mt-3", ""];
    const height = heights[index % heights.length];
    const offset = offsets[index % offsets.length];
    return `${base} ${height} ${offset}`;
  }
};

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
    <section className="dark bg-background relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 mb-16">
      <div className="max-w-6xl mx-auto px-6">
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
              className={getCardClassName(item, index)}
            >
              {/* Top Row: Logo or Category Tag */}
              <div className="flex items-center justify-between mb-6 w-full gap-2">
                {item.logo ? (
                  <div className="w-28 h-10 flex items-center relative">
                    <Image
                      src={item.logo}
                      alt={item.institution}
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                ) : (
                  <div className="h-10 flex items-center">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted/50 border border-border/20 px-2.5 py-1 rounded-full bg-surface/50">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                )}

                {item.logo && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted/50 border border-border/20 px-2.5 py-1 rounded-full bg-surface/50">
                    {getCategoryLabel(item.category)}
                  </span>
                )}
              </div>

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
      </div>
    </section>
  );
}
