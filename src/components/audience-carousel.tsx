"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AudienceCard } from "@/data/services-data";

interface AudienceCarouselProps {
  cards: AudienceCard[];
  title: string;
}

export function AudienceCarousel({ cards, title }: AudienceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);

    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const containerLeft = el.getBoundingClientRect().left;
    let closest = 0;
    let minDist = Infinity;
    children.forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - containerLeft);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  }

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  }

  function scrollToCard(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }

  return (
    <div className="mb-14 md:mb-20">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight">
          {title}
        </h2>

        {cards.length > 3 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-foreground hover:border-border/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-border/40 flex items-center justify-center text-muted hover:text-foreground hover:border-border/70 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:-mx-6 md:px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="group relative flex-none w-[80vw] sm:w-[45vw] md:w-[calc(33.333%-14px)] lg:w-[calc(33.333%-14px)] snap-start"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-border/30 bg-surface cursor-pointer">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 45vw, 33vw"
              />

              {/* Gradient overlay — darkens on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90 group-hover:via-black/50" />

              {/* Content — bottom-anchored with slide-up on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mb-2 block">
                  {card.title.split(" ").slice(0, 2).join(" ").toUpperCase()}
                </span>
                <h3 className="text-lg md:text-xl font-medium text-white leading-tight">
                  {card.title}
                </h3>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                  <div className="overflow-hidden">
                    <p className="text-sm text-white/80 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out delay-100 pt-3">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {cards.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to card ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border/50 hover:bg-border"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
