"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, ArrowUpRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";

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
  template_type: "grid" | "list" | "masonry";
  visible: boolean;
}

export default function PortfolioPage() {
  const supabase = createClient();
  const [config, setConfig] = useState<PortfolioConfig | null>(null);
  const [items, setItems] = useState<PortfolioItem[]>([]);
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
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (itemsError) throw itemsError;

        setItems(itemsData || []);
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!config?.visible) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio</h1>
          <p className="text-muted">El portfolio aún no está disponible.</p>
        </div>
      </div>
    );
  }

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
            Volver al inicio
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-6xl"
        >
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">
            Portfolio
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-normal">
            Explora mis trabajos y proyectos recientes. Cada proyecto representa mi compromiso con la excelencia en diseño y desarrollo.
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
            <>
              {config.template_type === "grid" && (
                <PortfolioGrid items={items} />
              )}
              {config.template_type === "list" && (
                <PortfolioList items={items} />
              )}
              {config.template_type === "masonry" && (
                <PortfolioMasonry items={items} />
              )}
            </>
          )}
        </div>
      </div>
    </main>
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
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted/40">Sin imagen</span>
                  </div>
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
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted/40 text-sm">Sin imagen</span>
                  </div>
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

// Masonry Template
function PortfolioMasonry({ items }: { items: PortfolioItem[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="break-inside-avoid group cursor-pointer"
        >
          <a
            href={item.project_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="bg-background border border-border/60 rounded-xl overflow-hidden hover:border-primary/50 transition-all">
              {/* Image */}
              <div className="relative w-full aspect-square bg-muted/10 overflow-hidden">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted/40">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex items-end p-6 rounded-xl">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-semibold text-primary/70 uppercase tracking-wider block mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}
