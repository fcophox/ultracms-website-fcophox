"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export interface RelatedItem {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  image_url?: string | null;
  category?: string;
  href: string;
}

interface RelatedArticlesCarouselProps {
  items: RelatedItem[];
  viewAllHref: string;
}

const gradients = [
  "from-primary/40 to-secondary/40",
  "from-secondary/40 to-accent/40",
  "from-accent/40 to-primary/40",
  "from-primary/40 to-accent/40",
  "from-secondary/40 to-primary/40",
  "from-accent/40 to-secondary/40",
];

export function RelatedArticlesCarousel({
  items,
  viewAllHref,
}: RelatedArticlesCarouselProps) {
  const t = useTranslations("ArticleNav");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      ro.disconnect();
    };
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by the width of one card + gap
    const card = el.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="w-full mt-20 pt-16 pb-8 border-t border-border">
      <div className="max-w-5xl mx-auto px-6 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-normal text-foreground leading-tight mb-2">
              {t("sectionTitle")}
            </h2>
            <p className="text-base text-muted leading-relaxed max-w-xl">
              {t("sectionSubtitle")}
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground border border-border hover:border-foreground/30 rounded-full px-5 py-2.5 transition-all shrink-0"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>

      {/* Carousel track */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollPaddingLeft: "max(1.5rem, calc((100vw - 64rem) / 2 + 1.5rem))",
          }}
        >
          {/* Left spacer */}
          <div className="shrink-0" style={{ width: "max(1.5rem, calc((100vw - 64rem) / 2 + 1.5rem))" }} />

          {items.map((item, i) => (
            <Link
              key={item.id}
              href={item.href}
              data-carousel-card
              className="group shrink-0 w-[280px] md:w-[300px] mr-6 rounded-2xl bg-surface overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] overflow-hidden relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className={`w-full h-full bg-gradient-to-br ${gradients[i % gradients.length]} group-hover:scale-105 transition-transform duration-500`}
                  />
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-medium text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">
                  {item.content.replace(/<[^>]*>/g, "").slice(0, 120)}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-muted group-hover:text-primary transition-colors">
                  {t("readMore")}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </div>
            </Link>
          ))}
          {/* Right spacer */}
          <div className="shrink-0" style={{ width: "max(0px, calc((100vw - 64rem) / 2))" }} />
        </div>

        {/* Navigation arrows */}
        <div className="max-w-5xl mx-auto px-6 mt-6 flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-foreground/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
