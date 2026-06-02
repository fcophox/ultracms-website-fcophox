"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { ArticleFeedback } from "./article-feedback";
import { useTranslations } from "next-intl";

interface ArticleLayoutProps {
  title: string;
  description: string;
  date: string;
  category: string;
  gradient: string;
  imageUrl?: string | null;
  backHref: string;
  backLabel: string;
  itemId?: string;
  tableName?: "articles" | "case_studies";
  prevArticle?: { title: string; slug: string; href: string; imageUrl?: string } | null;
  nextArticle?: { title: string; slug: string; href: string; imageUrl?: string } | null;
  children?: ReactNode;
}

export function ArticleLayout({
  title,
  description,
  date,
  category,
  gradient,
  imageUrl,
  backHref,
  backLabel,
  itemId,
  tableName,
  prevArticle,
  nextArticle,
  children,
}: ArticleLayoutProps) {
  const t = useTranslations('ArticleNav');

  return (
    <main className="w-full flex-1 flex flex-col items-center pt-8 pb-32">
      <article className="max-w-5xl mx-auto px-6 w-full">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            {backLabel}
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6"
          >
            <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full">
              {category}
            </span>
            <span className="text-sm text-muted">{date}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-3xl lg:text-5xl font-light text-foreground leading-tight mb-6"
          >
            {title}
          </motion.h1>

        </header>

        {/* Hero Image Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-2xl relative"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
          )}
        </motion.div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="prose prose-lg dark:prose-invert prose-headings:font-light prose-p:leading-relaxed prose-img:rounded-2xl prose-img:shadow-sm max-w-3xl mx-auto"
        >
          {children || (
            <>
              <h2>El problema y la estrategia</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae eros ut justo pulvinar consequat. Proin vel nunc id nunc aliquam viverra. Suspendisse potenti. Nam at nunc in lectus scelerisque bibendum.
              </p>
              <p>
                Phasellus nec sem id libero scelerisque consequat. Integer efficitur, nulla sed vestibulum tristique, lectus neque cursus mauris, sit amet eleifend justo elit non lacus.
              </p>
              <h3>La solución de diseño</h3>
              <p>
                Mauris viverra lacus id tellus finibus, vel venenatis nisi commodo. Proin id est vel risus viverra ultrices. In egestas eros rhoncus, feugiat ipsum scelerisque, facilisis dui. Nullam eu neque ut nisi vehicula semper.
              </p>
              <ul>
                <li>Investigación profunda de usuarios.</li>
                <li>Prototipado rápido y wireframes interactivos.</li>
                <li>Testing de usabilidad con métricas clave.</li>
              </ul>
              <p>
                Donec venenatis elit eu massa hendrerit, ac ultrices magna condimentum. Sed cursus, ligula vitae volutpat semper, neque arcu tincidunt sapien, eu pulvinar neque erat vel leo.
              </p>
            </>
          )}
        </motion.div>

        {/* Feedback Banner */}
        {itemId && tableName && (
          <ArticleFeedback itemId={itemId} tableName={tableName} />
        )}

        {/* Navigation */}
        {(prevArticle || nextArticle) && (
          <div className="w-full mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between gap-6">
            {prevArticle ? (
              <Link href={prevArticle.href} className="flex flex-row items-center gap-4 group flex-1 p-4 rounded-2xl bg-surface/50 border border-border/50 hover:bg-surface hover:border-border transition-all">
                {prevArticle.imageUrl ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-border/20">
                    <img src={prevArticle.imageUrl} alt={prevArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl shrink-0 bg-border/20" />
                )}
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-widest">{t('prev')}</span>
                  <span className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{prevArticle.title}</span>
                </div>
              </Link>
            ) : <div className="flex-1" />}

            {nextArticle ? (
              <Link href={nextArticle.href} className="flex flex-row items-center justify-end gap-4 group flex-1 p-4 rounded-2xl bg-surface/50 border border-border/50 hover:bg-surface hover:border-border transition-all">
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] font-medium text-muted uppercase tracking-widest">{t('next')}</span>
                  <span className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">{nextArticle.title}</span>
                </div>
                {nextArticle.imageUrl ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-border/20">
                    <img src={nextArticle.imageUrl} alt={nextArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl shrink-0 bg-border/20" />
                )}
              </Link>
            ) : <div className="flex-1" />}
          </div>
        )}
      </article>
    </main>
  );
}
