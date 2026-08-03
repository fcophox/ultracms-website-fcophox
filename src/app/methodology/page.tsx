"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, PenTool, BarChart3, ChevronDown, ChevronUp, Briefcase, Code2, Sparkles, TrendingUp, Layers, BookOpen, CheckCircle2 } from "lucide-react";
import { RevealImage } from "@/components/reveal-image";
import { Banner } from "@/components/banner";

const disciplines = [
  "Negocio",
  "Producto",
  "Datos",
  "Inteligencia Artificial",
  "Desarrollo",
  "Diseño",
];

const pillars = [
  {
    number: "01",
    title: "DISCOVER & FRAME",
    subtitle: "Entender el problema y definir la oportunidad correcta.",
    icon: Search,
    points: [
      "Investigación de usuarios",
      "Análisis de datos y comportamiento",
      "Benchmark y exploración con AI",
      "Identificación de oportunidades",
      "Definición de hipótesis de producto",
    ],
    outputs: [
      "Problem framing",
      "Opportunity map",
      "Propuesta de valor",
      "Dirección estratégica",
    ],
    objetivos: [
      "Comprender usuarios y stakeholders",
      "Entender el negocio",
      "Detectar oportunidades",
      "Reducir riesgos",
      "Priorizar iniciativas",
    ],
    actividades: [
      "Investigación de usuarios",
      "Análisis de datos y comportamiento",
      "Benchmark y exploración con AI",
      "Identificación de oportunidades",
      "Definición de hipótesis de producto",
      "UX Research & Discovery Workshops",
      "Stakeholder Interviews",
      "User Journey Mapping",
    ],
    resultados: [
      "Problema correctamente definido",
      "Visión compartida del producto",
      "Roadmap inicial",
      "Priorización basada en evidencia",
    ],
    entregables: [
      "Problem framing",
      "Opportunity map",
      "Propuesta de valor",
      "Dirección estratégica",
      "UX Audit Report",
      "User Journey Canvas",
    ],
  },
  {
    number: "02",
    title: "DESIGN & BUILD",
    subtitle: "Diseñar y construir un producto funcional.",
    icon: PenTool,
    points: [
      "Arquitectura de información",
      "UX/UI Design (alta fidelidad)",
      "Design System y componentes",
      "Desarrollo asistido con AI",
      "Integración de APIs y lógica",
      "Construcción de MVP funcional",
    ],
    outputs: [
      "Prototipo funcional",
      "MVP operativo",
      "Interfaces listas",
      "Base técnica escalable",
    ],
    objetivos: [
      "Diseñar experiencias útiles",
      "Reducir tiempos de desarrollo",
      "Crear sistemas escalables",
      "Construir productos listos para producción",
    ],
    actividades: [
      "Arquitectura de información",
      "UX/UI Design (alta fidelidad)",
      "Design System y componentes",
      "Desarrollo asistido con AI",
      "Integración de APIs y lógica",
      "Construcción de MVP funcional",
      "UX Engineering & Prototipado",
      "Accesibilidad & UX Writing",
    ],
    resultados: [
      "Interfaces listas para desarrollar",
      "Componentes reutilizables",
      "Consistencia visual",
      "Desarrollo más eficiente",
    ],
    entregables: [
      "Prototipo funcional",
      "MVP operativo",
      "Interfaces listas",
      "Base técnica escalable",
      "Design System Library",
      "Documentación funcional",
    ],
  },
  {
    number: "03",
    title: "VALIDATE & SCALE",
    subtitle: "Medir, optimizar y escalar con datos reales.",
    icon: BarChart3,
    points: [
      "Pruebas con usuarios reales",
      "Métricas de comportamiento",
      "CRO (Optimización de conversión)",
      "Iteración continua",
      "Roadmap evolutivo del producto",
    ],
    outputs: [
      "Insights de uso real",
      "Mejoras iterativas",
      "Roadmap evolutivo",
      "Producto listo para crecer",
    ],
    objetivos: [
      "Medir impacto",
      "Detectar oportunidades",
      "Optimizar continuamente",
      "Escalar el producto",
    ],
    actividades: [
      "Pruebas con usuarios reales",
      "Métricas de comportamiento",
      "CRO (Optimización de conversión)",
      "Iteración continua",
      "Roadmap evolutivo del producto",
      "Analytics & User Testing",
      "AI Insights & CRO Assessment",
    ],
    resultados: [
      "Mejor conversión",
      "Mejor experiencia",
      "Roadmap evolutivo",
      "Decisiones basadas en evidencia",
    ],
    entregables: [
      "Insights de uso real",
      "Mejoras iterativas",
      "Roadmap evolutivo",
      "Producto listo para crecer",
      "Dashboard de métricas",
      "Plan de optimización",
    ],
  },
];

const pillarBgImages = [
  "/methodology/bg-card-1.svg",
  "/methodology/bg-card-ia.png",
  "/methodology/bg-card-3.svg",
];

const cycle = [
  "Business",
  "Research",
  "Strategy",
  "Design",
  "Prototype",
  "Build",
  "Measure",
  "Optimize",
  "Scale",
];

const comparisonColumns = [
  "UX Tradicional",
  "Frontend Tradicional",
  "UX Engineer (FSEB)",
];

const comparisonRows: { capability: string; scores: number[] }[] = [
  { capability: "UX Research", scores: [5, 1, 3] },
  { capability: "Product Strategy", scores: [3, 1, 4] },
  { capability: "UX/UI Design", scores: [5, 2, 4] },
  { capability: "Prototyping", scores: [4, 3, 5] },
  { capability: "Frontend", scores: [1, 5, 5] },
  { capability: "Design Systems", scores: [4, 3, 5] },
  { capability: "Analytics", scores: [2, 2, 3] },
  { capability: "Inteligencia Artificial", scores: [1, 2, 4] },
  { capability: "Integración Negocio", scores: [2, 1, 3] },
  { capability: "MVP + Entrega", scores: [3, 3, 4] },
];

const careerPath = [
  "Graphic Designer",
  "UI Designer",
  "UX Designer",
  "Senior UX Designer",
  "UX Manager",
  "Head of UX",
  "Product Designer",
  "UX Engineer",
  "Product Design Consultant",
  "Full Stack Experience Builder",
];

const differentiators = [
  {
    title: "Diseño con visión de negocio",
    description: "Cada decisión responde a un objetivo estratégico.",
    icon: Briefcase,
  },
  {
    title: "Investigación con propósito",
    description: "La investigación existe para disminuir incertidumbre y acelerar decisiones.",
    icon: Search,
  },
  {
    title: "Diseño conectado con desarrollo",
    description: "El diseño considera restricciones técnicas desde el primer día.",
    icon: Code2,
  },
  {
    title: "Inteligencia Artificial integrada",
    description:
      "La IA acelera procesos, genera insights y mejora la toma de decisiones, sin reemplazar el criterio humano.",
    icon: Sparkles,
  },
  {
    title: "Optimización basada en datos",
    description:
      "Cada lanzamiento produce información que alimenta la siguiente versión del producto.",
    icon: TrendingUp,
  },
  {
    title: "Escalabilidad",
    description: "Todo está pensado para crecer sin perder consistencia.",
    icon: Layers,
  },
];

const principles = [
  "Diseñar menos. Pensar mejor.",
  "Validar antes de asumir.",
  "Construir antes de sobre documentar.",
  "Medir antes de decidir.",
  "Automatizar donde aporte valor.",
  "Mantener alineados usuarios, negocio y tecnología.",
  "Diseñar para el cambio continuo.",
];

const useCases = [
  "Nuevos productos digitales",
  "MVP",
  "Startups",
  "SaaS",
  "Plataformas impulsadas por IA",
  "Transformación Digital",
  "Rediseños completos",
  "Design Systems",
  "Optimización de conversión (CRO)",
  "Product Discovery",
  "UX Assessment",
  "Innovación empresarial",
];

function Rating({
  value,
  label,
  variant = "secondary",
}: {
  value: number;
  label: string;
  variant?: "secondary" | "accent";
}) {
  const activeBg = variant === "accent" ? "bg-accent" : "bg-secondary";
  return (
    <span className="inline-flex items-center justify-center gap-1" role="img" aria-label={`${label}: ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((step) => (
        <span
          key={step}
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-full ${step <= value ? activeBg : "bg-foreground/15"}`}
        />
      ))}
    </span>
  );
}

function SectionHeading({ eyebrow, title, centered }: { eyebrow?: string; title: string; centered?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      {eyebrow && (
        <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted/70 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-[2.5rem] font-normal text-foreground leading-[1.2] tracking-tight">
        {title}
      </h2>
    </motion.div>
  );
}

function PillarList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted/70 mb-4">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm text-muted leading-relaxed">
            <span className="mt-2 w-1 h-1 rounded-full bg-foreground/40 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowDiagram({ steps, highlightLast }: { steps: string[]; highlightLast?: boolean }) {
  return (
    <ol className="flex flex-col items-center gap-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const isHighlighted = highlightLast && isLast;
        return (
          <li key={step} className="flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
              className={`inline-flex items-center justify-center px-5 py-2.5 rounded-full border text-sm ${isHighlighted
                ? "border-foreground/40 bg-foreground/10 text-foreground font-medium"
                : "border-border/50 bg-surface/50 text-muted font-normal"
                }`}
            >
              {step}
            </motion.span>
            {!isLast && <span aria-hidden="true" className="w-px h-6 bg-border/60" />}
          </li>
        );
      })}
    </ol>
  );
}

export default function MethodologyPage() {
  const [showComparison, setShowComparison] = useState(false);
  return (
    <main className="w-full overflow-x-hidden flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Top Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-6xl"
        >
          <h1 className="text-4xl md:text-[3.5rem] font-normal text-foreground mb-8 leading-tight tracking-tight">
            Metodología: Full Stack Experience Builder <span className="text-muted/70 text-lg md:text-xl">(FSEB)</span>
          </h1>
          <div className="flex flex-col gap-4 text-lg md:text-xl text-muted leading-relaxed font-normal">
            <p>
              Conecto <strong className="text-foreground font-medium">estrategia</strong>,{" "}
              <strong className="text-foreground font-medium">investigación</strong>,{" "}
              <strong className="text-foreground font-medium">diseño</strong>,{" "}
              <strong className="text-foreground font-medium">tecnología</strong> e{" "}
              <strong className="text-foreground font-medium">inteligencia artificial</strong> para
              transformar problemas de negocio en productos digitales que generan impacto medible.
            </p>
          </div>
        </motion.div>

        {/* 4 Images Staggered Square Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {/* Fila 1, Columna 1 */}
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-surface relative">
            <RevealImage
              src="/about/desk.png"
              alt="Workspace"
              fill
              className="object-cover"
              delayMs={100}
            />
          </div>

          {/* Fila 1, Columna 2 (en blanco) */}
          <div className="hidden md:block" />

          {/* Fila 1, Columna 3 */}
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-surface relative">
            <RevealImage
              src="/about/cowork.png"
              alt="Coworking"
              fill
              className="object-cover"
              delayMs={200}
            />
          </div>

          {/* Fila 1, Columna 4 */}
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-surface relative">
            <RevealImage
              src="/about/coffeeshop.png"
              alt="Coffeeshop"
              fill
              className="object-cover"
              delayMs={300}
            />
          </div>

          {/* Fila 2, Columna 1 (en blanco) */}
          <div className="hidden md:block" />

          {/* Fila 2, Columna 2 */}
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-surface relative">
            <RevealImage
              src="/about/desktop.png"
              alt="Desktop setup"
              fill
              className="object-cover"
              delayMs={400}
            />
          </div>
        </div>

        {/* ¿Por qué nació FSEB? */}
        <section className="mb-56">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna 1 (Izquierda en blanco) */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Columnas 2 y 3 (Ocupa 2 de 3): Título y Contenido */}
            <div className="lg:col-span-2">
              <SectionHeading eyebrow="El problema" title="¿Por qué nació FSEB?" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6 text-muted text-base md:text-lg leading-relaxed"
              >
                <p>
                  Durante años el trabajo de UX se ha limitado a wireframes, research o interfaces ya que eso se cotrata por el negocio y esta bien, pero,
                  la revolición de IA ha entregado meyor habilidades a los Diseñadores de productos digitales, dándonos meyor alcance para dar valor desde la experiencia.
                </p>
                <p>Hoy más que nunca las empresas necesitan profesionales capaces de conectar:</p>
                <ul className="flex flex-wrap gap-2">
                  {disciplines.map((item) => (
                    <li
                      key={item}
                      className="text-sm border border-secondary/30 bg-secondary/10 text-secondary rounded-full px-4 py-1.5 font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-foreground">
                  <strong className="font-medium">El Full Stack Experience Builder (FSEB)</strong> nace
                  para eliminar esas barreras y ofrecer una forma integral de construir productos
                  digitales desde un mismo perfil con una amplia vision desde la experiencia, usabilidad y funcionalidad.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ¿Qué es FSEB? */}
        <section className="mb-16">
          <SectionHeading title="¿Qué es Full Stack Experience Builder?" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna Izquierda: Imagen Ebook (Aspecto Rectangular) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6 w-full aspect-[4/3] rounded-3xl overflow-hidden bg-surface relative border border-border/50 shadow-2xl"
            >
              <RevealImage
                src="/methodology/ebook.png"
                alt="Ebook Full Stack Experience Builder"
                fill
                className="object-cover"
                delayMs={200}
              />
            </motion.div>

            {/* Columna Derecha: Texto y Ghost Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6 flex flex-col gap-6 text-muted text-base md:text-lg leading-relaxed"
            >
              <p>
                <strong className="text-foreground font-medium">
                  Full Stack Experience Builder (FSEB)
                </strong>{" "}
                es un framework propio que combina Product Design, UX Engineering, Product Strategy,
                Business Thinking, Desarrollo Frontend e Inteligencia Artificial para acompañar el
                ciclo completo de vida de un producto digital.
              </p>
              <p>
                Comienza entendiendo el problema y continúa optimizando el producto después de su
                lanzamiento.
              </p>

              {/* Banner tipo Ghost: Anuncio Ebook */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-4 rounded-2xl border border-border/40 bg-surface/30 p-6 md:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-medium">
                      Próximamente • Ebook
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-foreground/90 font-normal leading-relaxed">
                    Actualmente estoy escribiendo el <strong className="font-medium text-foreground">Ebook oficial de este framework</strong>. En diciembre estará listo para compartirlo con la comunidad.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Los tres pilares */}
      <section className="dark bg-background w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-normal text-foreground leading-[1.2] tracking-tight">
              Los tres pilares del Framework
            </h2>
            <p className="text-muted text-lg md:text-xl font-normal mt-4">
              De la idea al producto digital que genera valor real.
            </p>
          </div>

          {/* Pillars Intro - Methodology Schema Cards Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-1 flex flex-col justify-between bg-surface rounded-3xl p-8 border-none relative z-10 overflow-hidden group shadow-sm"
              >
                {/* Background SVG Header */}
                <div
                  className="absolute top-0 left-0 w-full h-full bg-[url('/brand/headercard.png')] bg-top bg-repeat-x opacity-60 pointer-events-none"
                  style={{ backgroundSize: 'auto' }}
                />

                <div className="relative z-10 flex flex-col">
                  {/* Header Icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-foreground/5">
                    <pillar.icon className="w-6 h-6 text-foreground" aria-hidden="true" />
                  </div>

                  <h3 className="text-xl font-medium tracking-wide mb-2 text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-sm font-normal text-muted leading-relaxed mb-6">
                    {pillar.subtitle}
                  </p>

                  {/* List */}
                  <ul className="space-y-4 mb-8">
                    {pillar.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-foreground opacity-70" aria-hidden="true" />
                        <span className="leading-tight">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Output */}
                <div className="relative z-10 mt-auto pt-6 border-t border-border/10">
                  <div className="text-[9px] font-semibold text-muted tracking-widest mb-3 uppercase">
                    OUTPUT
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted">
                    {pillar.outputs.map((output) => (
                      <span
                        key={output}
                        className="px-3 py-1.5 rounded-full bg-background/60 border-none whitespace-nowrap"
                      >
                        {output}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 bg-surface/50 hover:bg-surface hover:border-foreground/30 text-sm font-medium text-muted hover:text-foreground transition-all duration-300 shadow-sm hover:shadow"
            >
              <span>Revisa los detalles</span>
              {showComparison ? (
                <ChevronUp className="w-4 h-4 text-foreground/60" />
              ) : (
                <ChevronDown className="w-4 h-4 text-foreground/60" />
              )}
            </button>
          </div>

          {/* Linear comparative section */}
          <AnimatePresence initial={false}>
            {showComparison && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="mt-20 border-t border-border/30 overflow-hidden"
              >
                {[
                  { label: "Objetivos", key: "objetivos" },
                  { label: "Actividades", key: "actividades" },
                  { label: "Resultados", key: "resultados" },
                  { label: "Entregables", key: "entregables" },
                ].map((section) => (
                  <div
                    key={section.key}
                    className="border-b border-border/30 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12"
                  >
                    {/* Category name (Left Column) */}
                    <div className="lg:col-span-1">
                      <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-muted/50 lg:sticky lg:top-24">
                        {section.label}
                      </h4>
                    </div>
                    {/* 3 columns matching the 3 pillars */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                      {pillars.map((pillar) => {
                        const items = pillar[section.key as "objetivos" | "actividades" | "resultados" | "entregables"];
                        return (
                          <div key={pillar.number} className="flex flex-col gap-2">
                            {/* Mobile/Tablet header for column identification */}
                            <div className="flex items-center gap-2 md:hidden mb-2">
                              <span className="text-[10px] font-mono bg-surface border border-border/50 text-muted px-2 py-0.5 rounded">
                                Pilar {pillar.number}
                              </span>
                              <span className="text-xs text-foreground font-medium">
                                {pillar.title}
                              </span>
                            </div>
                            <ul className="flex flex-col gap-2.5">
                              {items.map((item) => (
                                <li key={item} className="flex gap-3 text-sm text-muted leading-relaxed">
                                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/30 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 w-full">

        {/* Comparativa de perfiles */}
        <section className="pb-24">
          <SectionHeading eyebrow="Evolución del Product Design" title="Comparativa de perfiles" centered />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full overflow-x-auto rounded-3xl border border-border/50 max-w-3xl mx-auto"
          >
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Comparativa de capacidades entre perfiles, valoradas de 1 a 5
              </caption>
              <thead>
                <tr className="border-b border-border/50">
                  <th scope="col" className="px-6 py-5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted/70 font-normal">
                    Capacidades
                  </th>
                  {comparisonColumns.map((column, index) => {
                    const isHighlighted = column.includes("FSEB");
                    return (
                      <th
                        key={column}
                        scope="col"
                        className={`px-6 py-5 text-xs text-center ${isHighlighted
                          ? "text-accent font-semibold"
                          : "text-muted font-medium"
                          }`}
                      >
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.capability} className="border-b border-border/30 last:border-b-0">
                    <th scope="row" className="px-6 py-4 text-sm font-normal text-foreground">
                      {row.capability}
                    </th>
                    {row.scores.map((score, index) => {
                      const isHighlighted = comparisonColumns[index].includes("FSEB");
                      return (
                        <td
                          key={comparisonColumns[index]}
                          className="px-6 py-4 text-center"
                        >
                          <Rating
                            value={score}
                            label={`${row.capability} — ${comparisonColumns[index]}`}
                            variant={isHighlighted ? "accent" : "secondary"}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>


        {/* ¿Qué hace diferente a FSEB? */}
        <section className="pb-24">
          <SectionHeading title="¿Qué hace diferente a FSEB?" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (index % 3) * 0.1 }}
                className="flex flex-col gap-3 rounded-3xl border border-border/50 bg-surface/50 p-8"
              >
                {item.icon && (
                  <div className="mb-2">
                    <item.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                )}
                <h3 className="text-xl font-normal text-foreground">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Principios */}
        <section className="pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna 1 (Izquierda en blanco) */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Columnas 2 y 3 (Ocupa 2 de 3): Título y Contenido */}
            <div className="lg:col-span-2">
              <SectionHeading title="Principios del Framework" />

              <ul className="flex flex-col divide-y divide-border/30 border-y border-border/30">
                {principles.map((principle, index) => (
                  <motion.li
                    key={principle}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    className="flex items-center gap-5 py-5"
                  >
                    <span className="w-8 h-8 rounded-full border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-medium flex items-center justify-center shrink-0 shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg md:text-xl font-normal text-foreground">{principle}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ¿Cuándo utilizar FSEB? */}
        <section className="pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna 1 (Izquierda en blanco) */}
            <div className="hidden lg:block lg:col-span-1" />

            {/* Columnas 2 y 3 (Ocupa 2 de 3): Título y Contenido */}
            <div className="lg:col-span-2">
              <SectionHeading title="¿Cuándo utilizar FSEB?" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-8"
              >
                <p className="text-muted text-base md:text-lg leading-relaxed">
                  Este framework es ideal para:
                </p>
                <ul className="flex flex-wrap gap-3">
                  {useCases.map((useCase) => (
                    <li
                      key={useCase}
                      className="text-sm text-muted border border-border/50 bg-surface/50 rounded-full px-5 py-2"
                    >
                      {useCase}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Cierre */}
      <section className="dark bg-background w-full py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-8 max-w-4xl"
          >
            <h2 className="text-3xl md:text-[2.5rem] font-normal text-foreground leading-[1.2] tracking-tight">
              Más que UX. Más que desarrollo.
            </h2>
            <div className="flex flex-col gap-6 text-muted text-base md:text-lg leading-relaxed">
              <p>
                <strong className="text-foreground font-medium">
                  Full Stack Experience Builder
                </strong>{" "}
                representa una nueva forma de construir productos digitales.
              </p>
              <p>
                Una metodología donde la investigación, la estrategia, el diseño, la tecnología, los
                datos y la inteligencia artificial trabajan como un único sistema.
              </p>
              <p className="text-foreground text-lg md:text-xl font-normal leading-relaxed">
                Son productos digitales que generan valor para las personas y resultados para el
                negocio.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 w-full">
        <Banner />
      </div>
    </main>
  );
}
