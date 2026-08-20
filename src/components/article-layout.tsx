"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { ArticleFeedback } from "./article-feedback";
import { ReadingProgressBar } from "./reading-progress-bar";

interface ArticleLayoutProps {
  title: string;
  description: string;
  date: string;
  category: string;
  gradient: string;
  imageUrl?: string | null;
  backHref: string;
  backLabel: string;
  /** Slug del contenido en Kontorōru. Es la clave de las reacciones. */
  slug?: string;
  relatedArticlesSection?: ReactNode;
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
  slug,
  relatedArticlesSection,
  children,
}: ArticleLayoutProps) {

  return (
    <>
      <ReadingProgressBar />
      <main className="w-full flex-1 flex flex-col items-center pt-8 pb-32">
      <article className="dm-container">
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
        <header className="mb-12 text-left max-w-[760px] mx-auto w-full">
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
            className="text-xl md:text-3xl lg:text-5xl font-normal text-foreground leading-tight mb-6"
          >
            {title}
          </motion.h1>

        </header>

        {/* Hero Image Area */}
        <div className="max-w-[760px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full md:w-[110%] md:-ml-[5%] aspect-[21/9] rounded-3xl md:rounded-[2rem] overflow-hidden mb-16 shadow-2xl relative"
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
        </div>

        {/* Content Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="tiptap-content max-w-[760px] mx-auto"
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
        {slug && (
          <div className="max-w-[760px] mx-auto w-full">
            <ArticleFeedback slug={slug} />
          </div>
        )}
      </article>

      {/* Related Articles Carousel */}
      {relatedArticlesSection}
    </main>
    </>
  );
}
