"use client";

import Link from "next/link";
import { RevealImage } from "./reveal-image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";

export interface Project {
  id?: string;
  slug?: string;
  tag: string;
  title: string;
  description: string;
  tags: string[];
  colors: string[];
  image_url?: string;
}

export function ProjectCard({ projects = [] }: { projects?: Project[] }) {
  const t = useTranslations("ProjectCard");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop — the pinned stacking effect only runs on large screens.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track scroll progress (0 → 1) across the tall section.
  useEffect(() => {
    if (!isDesktop) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrollable = el.offsetHeight - window.innerHeight;
        if (scrollable <= 0) {
          setProgress(0);
          return;
        }
        const p = Math.min(1, Math.max(0, -rect.top / scrollable));
        setProgress(p);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isDesktop, projects.length]);

  if (!projects || projects.length === 0) return null;

  const Header = (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <span className="inline-block bg-muted/10 dark:bg-muted/5 border border-border/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-muted uppercase mb-4">
          {t("since")}
        </span>
        <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px]">
          {t("title")}
        </h2>
      </div>
      <Link
        href="/case-studies"
        className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors whitespace-nowrap mb-1"
      >
        <span className="text-sm font-medium">{t("viewAll")}</span>
        <ArrowUpRight
          size={20}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );

  // ---- Mobile / fallback: simple stacked list ----
  if (!isDesktop) {
    return (
      <section className="w-full relative z-10 bg-background overflow-visible">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="mb-16">{Header}</div>
          <div className="space-y-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <ProjectCardItem project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ---- Desktop: pinned stacking stage ----
  const N = projects.length;
  // Scroll distance allotted to the whole sequence, expressed in viewport heights.
  const sectionHeightVh = 100 + (N - 1) * 85;
  // Position along the timeline: 0 → N-1 (which card is at the front).
  const timeline = progress * (N - 1);

  return (
    <section
      ref={sectionRef}
      className="w-full relative z-10 bg-background"
      style={{ height: `${sectionHeightVh}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 h-full flex flex-col pt-16 pb-10">
          <div className="mb-20 shrink-0">{Header}</div>

          {/* Card stage */}
          <div className="relative flex-1">
            {projects.map((project, index) => {
              // How much this card has slid into place (0 → 1).
              const entered = index === 0 ? 1 : clamp(timeline - (index - 1), 0, 1);
              // How much the NEXT card has covered this one (0 → 1).
              const covered = clamp(timeline - index, 0, 1);

              const enterVH = (1 - entered) * 80; // comes up from below the viewport
              const coverPx = -covered * 30; // recedes upward when covered
              const scale = 1 - covered * 0.05;

              return (
                <div
                  key={index}
                  className="absolute inset-x-0 top-0"
                  style={{
                    zIndex: index,
                    transform: `translateY(calc(${enterVH}vh + ${coverPx}px)) scale(${scale})`,
                    transformOrigin: "top center",
                    transition: "none",
                    pointerEvents: covered > 0.5 ? "none" : "auto",
                  }}
                >
                  <ProjectCardItem project={project} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function ProjectCardItem({ project }: { project: Project }) {
  return (
    <div className="w-full">
      <Link
        href={project.slug ? `/case-studies/${project.slug}` : `/case-studies`}
        className="block no-underline w-full cursor-none"
        data-custom-cursor="true"
      >
        <div className="w-full rounded-3xl bg-surface border border-border/20 overflow-hidden flex flex-col md:flex-row shadow-2xl">
          <div className="w-full md:w-[50%] flex items-center justify-center p-6 md:p-10">
            <div className="relative w-full aspect-[29/20] rounded-xl overflow-hidden group border border-border/50">
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md border border-border/30 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300 z-10">
                <ArrowUpRight size={18} />
              </div>
              {project.image_url ? (
                <div className="w-full h-full relative">
                  <RevealImage
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${project.colors[0]}20, ${project.colors[1]}20)`,
                  }}
                >
                  <div
                    className="w-3/4 h-3/4 rounded-lg border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${project.colors[0]}40, ${project.colors[1]}40)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-10 flex flex-col justify-between w-full md:w-[50%] items-start text-left">
            <div className="space-y-6">
              <span className="text-xs font-medium text-secondary bg-secondary/10 px-3 py-1.5 rounded-full inline-block">
                {project.tag}
              </span>
              <h3 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px]">
                {project.title}
              </h3>
              <p className="text-muted leading-relaxed max-w-md">
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-8">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs text-muted bg-muted/20 border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
