"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, ArrowUpRight, ArrowRight, Layers, Sparkles, FileText, BarChart3, Code2, BookOpen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, useScroll, useTransform } from "framer-motion";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  published: boolean;
}

interface PortfolioConfig {
  template_type: "grid" | "list" | "gallery1" | "masonry";
  visible: boolean;
}

const cardGradients = [
  "from-blue-500/40 to-cyan-400/40",
  "from-purple-500/40 to-pink-500/40",
  "from-green-500/40 to-teal-400/40",
  "from-orange-500/40 to-red-500/40",
  "from-indigo-500/40 to-blue-500/40",
  "from-teal-500/40 to-emerald-400/40",
];

export default function PortfolioPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [recentCases, setRecentCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar configuración
        const { data: configData, error: configError } = await supabase
          .from("portfolio_config")
          .select("template_type, visible")
          .limit(1)
          .single();

        if (configError && configError.code !== "PGRST116") {
          throw configError;
        }

        if (!configData?.visible) {
          // Portfolio no es visible
          setConfig({ template_type: "grid", visible: false });
          setIsLoading(false);
          return;
        }

        setConfig(configData as PortfolioConfig);

        // Cargar proyectos publicados
        const { data: itemsData, error: itemsError } = await supabase
          .from("portfolio")
          .select("*")
          .eq("published", true);

        if (itemsError) throw itemsError;

        let fetchedItems = itemsData || [];

        // Sort items according to sort_order, order_index, position, or created_at
        fetchedItems.sort((a: any, b: any) => {
          const orderA = a.sort_order ?? a.order_index ?? a.position;
          const orderB = b.sort_order ?? b.order_index ?? b.position;

          if (orderA !== undefined && orderB !== undefined && orderA !== null && orderB !== null) {
            return orderA - orderB;
          }

          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setItems(fetchedItems);

        // Cargar los 3 últimos artículos de blog publicados
        const { data: articlesData } = await supabase
          .from("articles")
          .select("id, title, slug, image_url, category, published_at, created_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

        setRecentArticles(articlesData || []);

        // Cargar los 3 últimos casos de estudio publicados
        const { data: casesData } = await supabase
          .from("case_studies")
          .select("id, title, slug, image_url, category, published_at, created_at")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);

        setRecentCases(casesData || []);
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config?.visible) {
    return (
      <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32 bg-background">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio</h1>
          <p className="text-muted">El portfolio aún no está disponible.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32 overflow-x-hidden">
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
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Inicio
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 max-w-6xl"
        >
          <h1 className="text-4xl md:text-[3.5rem] font-normal text-foreground mb-8 leading-tight tracking-tight">
            Portfolio
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-normal">
            Explora una selección de mis proyectos más recientes en diseño de producto, UX engineering y desarrollo.
          </p>
        </motion.div>

        {/* Projects Section */}
        <div>
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted text-lg">No hay proyectos publicados aún.</p>
            </motion.div>
          ) : (
            <PortfolioGallery1 items={items} />
          )}
        </div>

        {/* Full-width Infinite Scroll Marquee */}
        <InfiniteMarquee />

        {/* Bottom Section - Blog Pages & Casos de Estudio Cards */}
        <PortfolioBottomSections recentArticles={recentArticles} recentCases={recentCases} />
      </div>
    </main>
  );
}

// Full-width Scroll-Driven Marquee Component
function InfiniteMarquee() {
  const { scrollYProgress } = useScroll();
  const scrollX = useTransform(scrollYProgress, [0, 1], [0, -400]);

  const phrases = [
    "UX Estratégico & Producto Digital",
    "Prototipos Funcionales & MVPs",
    "Medición UX, CRO & Validación Continua",
    "IA aplicada a Experiencias Digitales",
  ];

  // Doubled array for seamless 50% loop animation
  const marqueeList = [...phrases, ...phrases];

  return (
    <div className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden py-10 my-16 select-none pointer-events-none opacity-20 transition-opacity duration-300">
      <motion.div style={{ x: scrollX }} className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 75 }}
          className="flex whitespace-nowrap items-center shrink-0"
        >
          {marqueeList.map((text, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-14 mx-6 md:mx-10 shrink-0">
              <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-foreground/70 dark:text-foreground/80 font-sans transition-colors duration-300">
                {text}
              </span>
              <div className="relative w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 shrink-0">
                <Image
                  src="/brand/logotipo.svg"
                  alt="Isotipo"
                  fill
                  className="object-contain invert dark:invert-0 opacity-70 transition-all duration-300"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Grid Template
function PortfolioGrid({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group cursor-pointer"
        >
          <a
            href={item.project_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div className="bg-background border border-border/60 rounded-xl overflow-hidden hover:border-primary/50 transition-all h-full flex flex-col">
              {/* Image */}
              <div className="relative w-full h-48 bg-muted/10 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cardGradients[index % cardGradients.length]} opacity-80 group-hover:scale-105 transition-transform duration-500`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted flex-1">
                  {item.description?.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </p>
                {item.project_url && (
                  <div className="mt-4 flex items-center text-sm text-primary group-hover:translate-x-1 transition-transform">
                    Ver proyecto <ArrowUpRight size={14} className="ml-1" />
                  </div>
                )}
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}

// List Template
function PortfolioList({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <a
            href={item.project_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-background border border-border/60 rounded-xl p-6 hover:border-primary/50 hover:bg-surface/50 transition-all flex items-center gap-6">
              {/* Image */}
              <div className="relative w-32 h-32 flex-shrink-0 bg-muted/10 rounded-lg overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cardGradients[index % cardGradients.length]} opacity-80 group-hover:scale-105 transition-transform duration-500`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  {item.project_url && (
                    <ArrowUpRight size={18} className="text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-sm text-muted">
                  {item.description?.replace(/<[^>]*>/g, "").substring(0, 200)}...
                </p>
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}

// Galería 1 Template (Patrón repetitivo: 2 columnas, luego 3 columnas)
function PortfolioGallery1({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
      {items.map((item, index) => {
        const isTwoColumnRow = index % 5 < 2;
        const colSpanClass = isTwoColumnRow ? "md:col-span-3" : "md:col-span-2";
        const aspectClass = isTwoColumnRow ? "aspect-[16/10]" : "aspect-[4/3]";

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group cursor-pointer ${colSpanClass}`}
          >
            <a
              href={item.project_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              <div className={`relative ${aspectClass} w-full rounded-3xl overflow-hidden bg-background transition-all duration-500 shadow-md hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-end`}>
                {/* Background Image or Card Gradient */}
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${cardGradients[index % cardGradients.length]} opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out`} />
                )}

                {/* Category Pill Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
                    {item.category}
                  </span>
                </div>

                {/* Gradient Dark Overlay & Caption Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 z-10 flex flex-col justify-end p-6">
                  <h3 className={`font-bold text-white mb-1.5 group-hover:text-primary transition-colors duration-300 drop-shadow-sm ${isTwoColumnRow ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-300 line-clamp-2 mb-3 font-normal leading-relaxed">
                      {item.description.replace(/<[^>]*>/g, "")}
                    </p>
                  )}
                  {item.project_url && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary group-hover:translate-x-1 transition-transform">
                      Ver proyecto <ArrowUpRight size={14} />
                    </div>
                  )}
                </div>
              </div>
            </a>
          </motion.div>
        );
      })}
    </div>
  );
}

// Bento Covers Showcase Component (Overlapping tilted cover cards flush to card borders)
function BentoCoversShowcase({ items }: { items: any[] }) {
  const fallbackItems = [
    { id: "1", title: "Proyecto 1", image_url: null },
    { id: "2", title: "Proyecto 2", image_url: null },
    { id: "3", title: "Proyecto 3", image_url: null },
  ];

  const displayItems =
    items && items.length > 0
      ? items.length >= 3
        ? items.slice(0, 3)
        : [...items, ...fallbackItems.slice(items.length)]
      : fallbackItems;

  const leftItem = displayItems[0];
  const centerItem = displayItems[1] || displayItems[0];
  const rightItem = displayItems[2] || displayItems[0];

  return (
    <div className="relative pt-6 pb-4 w-[calc(100%+4rem)] md:w-[calc(100%+5rem)] -mx-8 md:-mx-10 flex items-center justify-center min-h-[240px] sm:min-h-[280px] select-none">
      {/* Left Tilted Cover Card */}
      <div className="w-40 sm:w-52 aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shrink-0 -rotate-12 translate-x-10 sm:translate-x-12 translate-y-3 group-hover:-rotate-6 group-hover:translate-x-6 transition-all duration-500 z-0 bg-background relative">
        {leftItem?.image_url ? (
          <Image
            src={leftItem.image_url}
            alt={leftItem.title || "Cover"}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cardGradients[0]}`} />
        )}
      </div>

      {/* Center Main Cover Card (Front) */}
      <div className="w-48 sm:w-60 aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] shrink-0 z-10 group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-500 bg-background relative">
        {centerItem?.image_url ? (
          <Image
            src={centerItem.image_url}
            alt={centerItem.title || "Cover"}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cardGradients[1]}`} />
        )}
      </div>

      {/* Right Tilted Cover Card */}
      <div className="w-40 sm:w-52 aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shrink-0 rotate-12 -translate-x-10 sm:-translate-x-12 translate-y-3 group-hover:rotate-6 group-hover:-translate-x-6 transition-all duration-500 z-0 bg-background relative">
        {rightItem?.image_url ? (
          <Image
            src={rightItem.image_url}
            alt={rightItem.title || "Cover"}
            fill
            className="object-cover w-full h-full"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${cardGradients[2]}`} />
        )}
      </div>
    </div>
  );
}

// Bottom Section Showcase Cards (Blog Pages & Casos de Estudio)
function PortfolioBottomSections({
  recentArticles,
  recentCases,
}: {
  recentArticles: any[];
  recentCases: any[];
}) {
  return (
    <div className="mt-28 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Card 1: Blog Pages */}
        <Link href="/blog" className="block group">
          <div className="relative rounded-3xl bg-surface/30 backdrop-blur-md transition-all duration-500 p-8 md:p-10 flex flex-col justify-between h-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">

            {/* Header / Text section */}
            <div className="text-center relative z-10 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Blog
              </h2>

              {/* Badges / Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Ideas
                </span>
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Pensamientos
                </span>
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Inspiración
                </span>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted max-w-sm mx-auto leading-relaxed">
                Un espacio con lecturas claras, análisis y reflexiones sobre diseño de producto y tecnología.
              </p>
            </div>

            {/* Bento Covers Showcase for Blog */}
            <BentoCoversShowcase items={recentArticles} />

            {/* Bottom Arrow indicator */}
            <div className="pt-4 flex justify-center items-center text-sm md:text-base font-semibold text-foreground group-hover:text-primary gap-2 transition-colors relative z-20">
              Explorar Blog <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>

          </div>
        </Link>


        {/* Card 2: Casos de Estudio (Portfolio / Case Studies) */}
        <Link href="/case-studies" className="block group">
          <div className="relative rounded-3xl bg-surface/30 backdrop-blur-md transition-all duration-500 p-8 md:p-10 flex flex-col justify-between h-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">

            {/* Header / Text section */}
            <div className="text-center relative z-10 mb-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                Casos de Estudio
              </h2>

              {/* Badges / Pills */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Showcase
                </span>
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Visión
                </span>
                <span className="px-4 py-1 rounded-full border border-border/80 text-xs font-medium text-foreground bg-background/50">
                  Diseño
                </span>
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted max-w-sm mx-auto leading-relaxed">
                Proyectos explicados paso a paso con metodología, decisiones estratégicas y resultados de impacto.
              </p>
            </div>

            {/* Bento Covers Showcase for Case Studies */}
            <BentoCoversShowcase items={recentCases} />

            {/* Bottom Arrow indicator */}
            <div className="pt-4 flex justify-center items-center text-sm md:text-base font-semibold text-foreground group-hover:text-primary gap-2 transition-colors relative z-20">
              Ver Casos de Estudio <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </div>

          </div>
        </Link>

      </div>
    </div>
  );
}
