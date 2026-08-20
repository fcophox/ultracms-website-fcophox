import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { Banner } from "@/components/banner";
import { Blog } from "@/components/blog";
// import { BentoSection } from "@/components/bento-section";
import { UxBento } from "@/components/ux-bento";
import { ServicesSection } from "@/components/services-section";
import { ExperienceLogos } from "@/components/experience-logos";
import { ToolsSection } from "@/components/tools-section";
import { Metadata } from "next";
import { getTranslations, getLocale } from 'next-intl/server';
import { kontororu, CATEGORIA } from "@/utils/kontororu";
import { aListadoArray } from "@/utils/kontororu-adapter";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: {
      absolute: t('homeTitle'),
    },
    description: "Explora el portafolio de Fcophox, descubre mis proyectos recientes, metodologías y artículos sobre diseño y desarrollo web.",
  };
}

/*
 * Era 0 —sin caché— porque el contenido salía de Supabase y no había forma de
 * saber cuándo cambiaba. Ahora avisa el webhook, así que se puede cachear.
 */
export const revalidate = 3600;

export default async function Home() {
  const { data: casos } = await kontororu.posts.list({
    categoria: CATEGORIA.casosDeEstudio,
    limit: 6,
  });

  const mappedProjects = aListadoArray(casos).map((c, i) => {
    const colorPalettes = [
      ["#3b82f6", "#06b6d4"],
      ["#8b5cf6", "#ec4899"],
      ["#22c55e", "#14b8a6"],
      ["#f97316", "#ef4444"],
      ["#eab308", "#f97316"],
      ["#ec4899", "#8b5cf6"]
    ];
    return {
      id: c.id,
      slug: c.slug,
      tag: c.category || "Case Study",
      title: c.title,
      // `content` ya es el excerpt del editor, no HTML que haya que limpiar.
      description: c.content || "Explora este caso de estudio.",
      tags: c.tags ?? [],
      colors: colorPalettes[i % colorPalettes.length],
      image_url: c.image_url ?? undefined,
    };
  });

  return (
    <main className="min-h-screen flex flex-col relative bg-background transition-colors duration-300">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <Hero />
      <ProjectCard projects={mappedProjects} />
      <UxBento />
      <ServicesSection />
      {/* <BentoSection /> */}
      <ExperienceLogos />
      <ToolsSection />
      <Blog />
      <Banner />
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-5 mix-blend-overlay pointer-events-none" />
    </main>
  );
}
