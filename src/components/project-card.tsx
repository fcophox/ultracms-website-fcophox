"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";

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
  const t = useTranslations('ProjectCard');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  // If there are no projects, don't render the section
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section ref={containerRef} className="w-full relative z-10 bg-background overflow-visible">
      <div className="max-w-6xl mx-auto px-6 mb-16 md:mb-24 sticky top-20 z-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-background py-12 -ml-4 pl-4 rounded-r-xl">
          <div>
            <p className="text-xs text-muted tracking-widest uppercase mb-2">
              {t('since')}
            </p>
            <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-4">
              {t('title')}
            </h2>
          </div>
          <Link
            href="/case-studies"
            className="group flex items-center gap-2 text-muted hover:text-foreground transition-colors whitespace-nowrap"
          >
            <span className="text-sm font-medium">{t('viewAll')}</span>
            <ArrowUpRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-1 relative pb-24">
        <div className="hidden xl:block absolute -left-20 top-0 bottom-0 w-4">
          <div className="sticky top-[45vh] flex flex-col gap-3">
            {projects.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-500 rounded-full ${activeIndex === i
                  ? "h-8 w-2 bg-primary"
                  : "h-2 w-2 bg-foreground/20"
                  }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-0 pb-32">
          {projects.map((project, index) => (
            <ProjectCardItem
              key={index}
              project={project}
              index={index}
              total={projects.length}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCardItem({
  project,
  index,
  total,
  activeIndex,
  setActiveIndex,
}: {
  project: Project;
  index: number;
  total: number;
  activeIndex: number;
  setActiveIndex: (v: number) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { margin: "-45% 0px -45% 0px" });

  // Calculate target scale based on activeIndex
  // Each card behind the active card is progressively smaller by 4%
  const targetScale = index <= activeIndex ? 1 - (activeIndex - index) * 0.1 : 1;

  useEffect(() => {
    if (inView) setActiveIndex(index);
  }, [inView, index, setActiveIndex]);

  return (
    <div
      ref={cardRef}
      className="w-full mb-[8vh]"
      style={{
        position: "sticky",
        top: "288px", // matches sticky top-72 (18rem)
        zIndex: index,
        paddingTop: `${index * 12}px`,
      } as React.CSSProperties}
    >
      <Link
        href={project.slug ? `/case-studies/${project.slug}` : `/case-studies`}
        className="block no-underline w-full cursor-none"
        data-custom-cursor="true"
      >
        <motion.div
          className="w-full rounded-3xl bg-surface border-none overflow-hidden flex flex-col md:flex-row shadow-2xl origin-top"
          animate={{
            scale: targetScale,
          }}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            scale: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.8, delay: index * 0.1, ease: "easeOut" },
            y: { duration: 0.8, delay: index * 0.1, ease: "easeOut" },
          }}
        >
          <div className="w-full md:w-[50%] flex items-center justify-center p-6 md:p-10">
            <div className="relative w-full aspect-[29/20] rounded-xl overflow-hidden group border border-border/50">
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-foreground/10 backdrop-blur-md border border-border/30 flex items-center justify-center text-foreground group-hover:bg-foreground group-hover:text-background transition-all duration-300 z-10">
                <ArrowUpRight size={18} />
              </div>
              {project.image_url ? (
                <div className="w-full h-full relative">
                  <Image
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
        </motion.div>
      </Link>
    </div>
  );
}
