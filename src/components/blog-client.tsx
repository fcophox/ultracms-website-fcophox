"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { RevealImage } from "./reveal-image";

export interface Article {
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

interface BlogClientProps {
  articles: Article[];
}

const gradients = [
  "from-primary/40 to-secondary/40",
  "from-secondary/40 to-accent/40",
  "from-accent/40 to-primary/40",
  "from-primary/40 to-accent/40",
  "from-secondary/40 to-primary/40",
  "from-accent/40 to-secondary/40",
];

const getGradient = (index: number) => gradients[index % gradients.length];

export function BlogClient({ articles }: BlogClientProps) {
  const t = useTranslations('BlogPage');
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  // Helper to format date nicely
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
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

        {/* Featured Article */}
        {featuredArticle && (
          <Link href={`/blog/${featuredArticle.slug}`} className="block cursor-none" data-custom-cursor="true">
            <motion.div
              key={featuredArticle.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 md:mb-16 rounded-3xl border-none bg-surface overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
            >
              <div className="w-full md:w-3/5 overflow-hidden relative h-48 md:h-auto md:min-h-[350px]">
                {featuredArticle.image_url ? (
                  <RevealImage
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    useImgTag={true}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    wrapperClassName="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className={`w-full h-full absolute inset-0 bg-gradient-to-br ${getGradient(0)} group-hover:scale-105 transition-transform duration-500`} />
                )}
              </div>

              <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm text-muted">{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
                    {featuredArticle.category}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-light text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>
                <div className="text-base md:text-lg text-muted leading-relaxed line-clamp-3">
                  {featuredArticle.content.replace(/<[^>]*>/g, '')}
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Grid Articles */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridArticles.map((article, index) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="block cursor-none" data-custom-cursor="true">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border-none bg-surface overflow-hidden group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col h-full"
                >
                  <div className="overflow-hidden relative h-48 w-full">
                    {article.image_url ? (
                      <RevealImage
                        src={article.image_url}
                        alt={article.title}
                        useImgTag={true}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        wrapperClassName="w-full h-full"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${getGradient(index + 1)} group-hover:scale-105 transition-transform duration-500`} />
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs text-muted">{formatDate(article.published_at || article.created_at)}</span>
                      <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full ml-auto">
                        {article.category}
                      </span>
                    </div>

                    <h3 className="text-[clamp(1rem,2.4vw,1.2rem)] font-light text-foreground leading-tight text-left w-full mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="text-sm text-muted leading-relaxed mt-auto line-clamp-2">
                      {article.content.replace(/<[^>]*>/g, '')}
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
