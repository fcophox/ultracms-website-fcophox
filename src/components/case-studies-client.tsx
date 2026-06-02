"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export interface CaseStudy {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  image_url?: string | null;
  category: string;
  status: string;
  published_at?: string | null;
  created_at?: string | null;
  tags?: string[] | null;
  likes?: number | null;
}

interface CaseStudiesClientProps {
  cases: CaseStudy[];
}

const gradients = [
  "from-blue-500/40 to-cyan-400/40",
  "from-purple-500/40 to-pink-500/40",
  "from-green-500/40 to-teal-400/40",
  "from-orange-500/40 to-red-500/40",
  "from-indigo-500/40 to-blue-500/40",
  "from-teal-500/40 to-emerald-400/40",
];

const getGradient = (index: number) => gradients[index % gradients.length];

export function CaseStudiesClient({ cases }: CaseStudiesClientProps) {
  const t = useTranslations('CaseStudiesPage');
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(cases.map((c) => c.category).filter(Boolean)))];

  const filteredCases =
    activeCategory === "All"
      ? cases
      : cases.filter((c) => c.category === activeCategory);

  const featuredCase = filteredCases[0];
  const gridCases = filteredCases.slice(1);

  const formatYear = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

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
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-start gap-3 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === category
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-surface border border-border text-muted hover:text-foreground hover:border-foreground/30"
                }`}
            >
              {category === "All" ? t('catAll') : category}
            </button>
          ))}
        </motion.div>

        {/* Featured Case */}
        {featuredCase && (
          <Link href={`/case-studies/${featuredCase.slug}`} className="block h-full cursor-none" data-custom-cursor="true">
            <motion.div
              key={featuredCase.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 md:mb-16 rounded-3xl border-none bg-surface overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
            >
              <div className="w-full md:w-3/5 overflow-hidden relative min-h-[350px]">
                {featuredCase.image_url ? (
                  <img
                    src={featuredCase.image_url}
                    alt={featuredCase.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full absolute inset-0 bg-gradient-to-br ${getGradient(0)} group-hover:scale-105 transition-transform duration-500`} />
                )}
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-muted">{formatYear(featuredCase.published_at || featuredCase.created_at)}</span>
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
                    {featuredCase.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-light text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                  {featuredCase.title}
                </h2>
                <div className="text-base md:text-lg text-muted leading-relaxed line-clamp-3">
                  {featuredCase.content.replace(/<[^>]*>/g, '')}
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Cases Grid */}
        {gridCases.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridCases.map((c, index) => (
              <Link href={`/case-studies/${c.slug}`} key={c.id} className="block cursor-none" data-custom-cursor="true">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border-none bg-surface overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full"
                >
                  <div className="overflow-hidden relative h-48 w-full">
                    {c.image_url ? (
                      <img
                        src={c.image_url}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getGradient(index + 1)} group-hover:scale-105 transition-transform duration-500`} />
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs text-muted">{formatYear(c.published_at || c.created_at)}</span>
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full ml-auto">
                        {c.category}
                      </span>
                    </div>

                    <h3 className="text-[clamp(1rem,2.4vw,1.2rem)]  font-light text-foreground leading-tight text-left w-full mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {c.title}
                    </h3>
                    <div className="text-sm text-muted leading-relaxed mt-auto line-clamp-2">
                      {c.content.replace(/<[^>]*>/g, '')}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
