"use client";

import type { AudienceCard } from "@/data/services-data";
import {
  Rocket,
  Building2,
  Users,
  TrendingUp,
  Layers,
  Briefcase,
  Sparkles,
  Cpu,
  Workflow,
  Target,
  LucideIcon,
} from "lucide-react";

interface AudienceCarouselProps {
  cards: AudienceCard[];
  title: string;
}

function getCardIcon(card: AudienceCard, index: number): LucideIcon {
  if (card.icon) {
    const key = card.icon.toLowerCase();
    if (key.includes("rocket")) return Rocket;
    if (key.includes("building")) return Building2;
    if (key.includes("user")) return Users;
    if (key.includes("trend") || key.includes("grow")) return TrendingUp;
    if (key.includes("layer")) return Layers;
    if (key.includes("case") || key.includes("brief")) return Briefcase;
    if (key.includes("sparkle") || key.includes("ai")) return Sparkles;
    if (key.includes("cpu") || key.includes("tech")) return Cpu;
    if (key.includes("flow")) return Workflow;
    if (key.includes("target")) return Target;
  }

  const titleLower = card.title.toLowerCase();
  if (
    titleLower.includes("startup") ||
    titleLower.includes("temprana") ||
    titleLower.includes("early") ||
    titleLower.includes("validar")
  ) {
    return Rocket;
  }
  if (
    titleLower.includes("empresa") ||
    titleLower.includes("producto digital") ||
    titleLower.includes("company") ||
    titleLower.includes("experiencia digital")
  ) {
    return Building2;
  }
  if (
    titleLower.includes("equipo") ||
    titleLower.includes("innovación") ||
    titleLower.includes("team") ||
    titleLower.includes("squad") ||
    titleLower.includes("diseño")
  ) {
    return Users;
  }
  if (
    titleLower.includes("comercial") ||
    titleLower.includes("marketing") ||
    titleLower.includes("eficiencia") ||
    titleLower.includes("operaciones")
  ) {
    return TrendingUp;
  }
  if (
    titleLower.includes("rediseñar") ||
    titleLower.includes("escalar") ||
    titleLower.includes("crecimiento") ||
    titleLower.includes("scale")
  ) {
    return Layers;
  }
  if (
    titleLower.includes("founder") ||
    titleLower.includes("presentar") ||
    titleLower.includes("solución")
  ) {
    return Briefcase;
  }
  if (
    titleLower.includes("ia") ||
    titleLower.includes("inteligencia") ||
    titleLower.includes("diferenciar")
  ) {
    return Sparkles;
  }

  const defaultIcons = [Rocket, Building2, Users, TrendingUp, Layers, Sparkles];
  return defaultIcons[index % defaultIcons.length];
}

export function AudienceCarousel({ cards, title }: AudienceCarouselProps) {
  return (
    <div className="mb-14 md:mb-20">
      <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-normal text-foreground leading-tight mb-8 md:mb-12">
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card, idx) => {
          const IconComponent = getCardIcon(card, idx);
          return (
            <div
              key={idx}
              className="group relative flex flex-col items-start p-6 md:p-8 rounded-2xl md:rounded-3xl border border-border/30 bg-surface/40 hover:bg-surface/70 hover:border-border/60 transition-all duration-300"
            >
              {/* Linear circle container with project background */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-border/40 bg-surface flex items-center justify-center text-foreground group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-300 shadow-sm mb-6">
                <IconComponent className="w-6 h-6 md:w-7 md:h-7 stroke-[1.75]" />
              </div>

              {/* Text underneath */}
              <h3 className="text-lg md:text-xl font-medium text-foreground tracking-tight mb-2.5">
                {card.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

