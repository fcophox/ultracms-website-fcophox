import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, AlertCircle, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { getLocale } from "next-intl/server";
import { mapToLocale } from "@/utils/locale-mapper";
import { ArticleLayout } from "@/components/article-layout";
import { servicesData } from "@/data/services-data";
import { ScrollProgressLine } from "@/components/scroll-progress-line";
import { AudienceCarousel } from "@/components/audience-carousel";
import { MotionDiv, MotionH1, MotionP, MotionSpan } from "@/components/motion-wrapper";

export const revalidate = 60; // Cache pages for 1 minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const isEs = locale === "es";

  // Check if it's one of our core services
  const coreService = servicesData[slug];
  if (coreService) {
    const data = locale === "en" ? coreService.en : coreService.es;
    return {
      title: `${data.title} | Fcophox`,
      description: data.shortDesc,
    };
  }

  // Fallback: Check Supabase database
  const supabase = await createClient();
  const { data: rawService } = await supabase
    .from("services")
    .select("title, content, image_url, title_en, content_en")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .single();

  if (!rawService) {
    return {
      title: isEs ? "Servicio no encontrado" : "Service not found",
      description: isEs ? "Este servicio no existe o ha sido eliminado." : "This service does not exist or has been removed.",
    };
  }

  const service = mapToLocale(rawService, locale);
  const cleanExcerpt = service.content
    ? service.content.replace(/<[^>]*>?/gm, '').substring(0, 160).trim() + "..."
    : "";

  return {
    title: `${service.title} | Fcophox`,
    description: cleanExcerpt,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const isEs = locale === "es";

  const labels = {
    back: isEs ? "Volver a Inicio" : "Back to Home",
    forWho: isEs ? "Para quién es" : "Who it is for",
    roadmap: isEs ? "Proceso / Roadmap" : "Process / Roadmap",
    plans: isEs ? "Planes estratégicos para la evolución" : "Strategic plans for the evolution",
    conditions: isEs ? "Supuestos y condiciones" : "Assumptions & conditions",
    idealFor: isEs ? "Ideal para:" : "Ideal for:",
    milestone: isEs ? "Hito" : "Milestone",
    description: isEs ? "Descripción" : "Description",
    percentage: isEs ? "Porcentaje" : "Percentage"
  };

  // 1. Render structured template if it's a core service
  const coreService = servicesData[slug];
  if (coreService) {
    const data = locale === "en" ? coreService.en : coreService.es;

    return (
      <main className="min-h-screen relative py-8 md:py-20">

        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground text-sm font-medium transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              {labels.back}
            </Link>

            <div className="flex flex-col gap-4">
              <MotionSpan
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="self-start bg-muted/10 dark:bg-muted/5 border border-border/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-muted uppercase"
              >
                {data.badge}
              </MotionSpan>
              <MotionH1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-6xl font-light text-foreground leading-tight tracking-tight"
              >
                {data.title}
              </MotionH1>
              <MotionP
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base md:text-xl text-muted font-light max-w-3xl leading-relaxed mt-2"
              >
                {data.shortDesc}
              </MotionP>
            </div>
          </div>

          {/* Hero Image */}
          {data.imageUrl && (
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-[2rem] overflow-hidden border border-border/40 bg-surface shadow-lg mb-10 md:mb-16"
            >
              <Image
                src={data.imageUrl}
                alt={data.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </MotionDiv>
          )}

          {/* Core Content */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto mb-14 md:mb-20"
          >
            {/* Description */}
            <div className="mb-10 md:mb-12">
              <h2 className="text-2xl font-light text-foreground tracking-tight mb-4">
                {isEs ? "Descripción de la capacidad" : "Capability Description"}
              </h2>
              <p className="text-muted leading-relaxed text-base md:text-lg whitespace-pre-line">
                {data.longDesc}
              </p>
            </div>
          </MotionDiv>

          {/* Audience Cards — Para quién es */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <AudienceCarousel
              cards={data.audienceCards}
              title={isEs ? "¿Para quién es este servicio?" : "Who is this service for?"}
            />
          </MotionDiv>

          {/* Why & What — Two columns */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-42"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-light text-foreground tracking-tight mb-4">
                {isEs ? "¿Por qué lo necesitarías?" : "Why would you need it?"}
              </h3>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                {data.whyNeed}
              </p>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-light text-foreground tracking-tight mb-4">
                {isEs ? "¿Qué obtendrías como aporte?" : "What would you get?"}
              </h3>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                {data.whatYouGet}
              </p>
            </div>
          </MotionDiv>

          {/* Roadmap / Process — Visual Timeline */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-18 md:mb-48"
          >
            <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left mb-20">
              {isEs ? "Actividades basado en la metdología" : "Activities based on the methodology"}
            </h2>


            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              {/* Left — Intro + Vertical Distribution Bar */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-3">
                    {isEs ? "Hitos del proceso" : "Process milestones"}
                  </p>
                  <p className="text-sm text-muted leading-relaxed mb-8">
                    {isEs
                      ? "Un paso a paso claro y estructurado para asegurar que cada etapa del proyecto aporte valor y nos acerque al objetivo final."
                      : "A clear, structured step-by-step process to ensure every project stage delivers value and moves us closer to the final goal."}
                  </p>
                </div>
              </div>

              {/* Right — Vertical Timeline */}
              <div className="lg:col-span-8">
                <div className="relative">
                  <ScrollProgressLine />

                  <div className="space-y-12 md:space-y-24">
                    {data.roadmap.map((item, index) => (
                      <div key={index} className="relative pl-14 md:pl-16">
                        <div className="absolute left-0 top-0 z-10 w-[41px] h-[41px] rounded-full bg-background border border-2 border-primary flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary leading-none">{item.percentage}</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-light text-foreground mb-1.5">
                          {index + 1}. {item.milestone}
                        </h3>
                        <p className="text-sm md:text-base text-muted leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MotionDiv>

          {/* Pricing Plans Grid */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight mb-6 md:mb-8 tracking-tight text-center">
              {labels.plans}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {data.plans.map((plan, index) => {
                const tierLabels = isEs
                  ? ["STARTER", "GROWTH", "SCALE"]
                  : ["STARTER", "GROWTH", "SCALE"];
                return (
                  <div
                    key={index}
                    className="rounded-2xl p-6 md:p-8 flex flex-col bg-surface border border-border/40 transition-all duration-300 hover:-translate-y-1 hover:border-border/70"
                  >
                    {/* Tier Badge */}
                    <span className="self-start border border-border/60 px-3 py-1 rounded-full text-[10px] font-semibold tracking-[0.15em] text-muted uppercase mb-5">
                      {tierLabels[index] ?? tierLabels[0]}
                    </span>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-light text-foreground mb-2 leading-tight">
                      {plan.name.includes("—") ? plan.name.split("—").pop()!.trim() : plan.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-sm text-muted/70 leading-relaxed mb-6 md:mb-8">
                      {plan.subtitle}
                    </p>

                    {/* Includes Label */}
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted mb-4">
                      {isEs ? "INCLUYE" : "INCLUDES"}
                    </p>

                    {/* Includes List */}
                    <ul className="space-y-3 flex-1">
                      {plan.includes.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted leading-relaxed">
                          <Check size={14} strokeWidth={2.5} className="shrink-0 text-primary mt-0.5" />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </MotionDiv>

          {/* Conditions & Assumptions */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left mb-6">
              {labels.conditions}
            </h2>
            <ul className="space-y-3">
              {data.conditions.map((item, index) => (
                <li key={index} className="text-xs md:text-sm text-muted leading-relaxed flex items-start gap-3">
                  <span className="text-xs font-semibold text-muted/60 mt-0.5 shrink-0">
                    {(index + 1).toString().padStart(2, '0')}.
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </MotionDiv>

          {/* Prev / Next Capabilities */}
          {(() => {
            const slugs = Object.keys(servicesData);
            const currentIndex = slugs.indexOf(slug);
            const prevSlug = slugs[(currentIndex - 1 + slugs.length) % slugs.length];
            const nextSlug = slugs[(currentIndex + 1) % slugs.length];
            const prevData = locale === "en" ? servicesData[prevSlug].en : servicesData[prevSlug].es;
            const nextData = locale === "en" ? servicesData[nextSlug].en : servicesData[nextSlug].es;

            return (
              <div className="mt-20 md:mt-32 border-t border-border/30 pt-12 md:pt-16">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-8">
                  {isEs ? "Explorar más capabilities" : "Explore more capabilities"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Previous */}
                  <Link href={`/capabilities/${prevSlug}`} className="group block no-underline">
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-4 border border-border/30 bg-surface">
                      <Image
                        src={prevData.imageUrl}
                        alt={prevData.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted mb-1 block">
                      {isEs ? "Anterior" : "Previous"}
                    </span>
                    <h3 className="text-lg md:text-xl font-light text-foreground group-hover:text-primary transition-colors mb-1">
                      {prevData.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">
                      {prevData.shortDesc}
                    </p>
                  </Link>

                  {/* Next */}
                  <Link href={`/capabilities/${nextSlug}`} className="group block no-underline">
                    <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-4 border border-border/30 bg-surface">
                      <Image
                        src={nextData.imageUrl}
                        alt={nextData.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted mb-1 block">
                      {isEs ? "Siguiente" : "Next"}
                    </span>
                    <h3 className="text-lg md:text-xl font-light text-foreground group-hover:text-primary transition-colors mb-1">
                      {nextData.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2">
                      {nextData.shortDesc}
                    </p>
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      </main>
    );
  }

  // 2. Fallback: load custom dynamic service from Supabase
  const supabase = await createClient();
  const { data: rawService, error } = await supabase
    .from("services")
    .select("*")
    .or(`slug.eq.${slug},slug_en.eq.${slug}`)
    .single();

  if (error || !rawService) {
    console.error(`Service not found with slug '${slug}':`, error);
    notFound();
  }

  const service = mapToLocale(rawService, locale);
  const cleanExcerpt = service.content
    ? service.content.replace(/<[^>]*>/g, '').slice(0, 160).trim() + "..."
    : "";

  return (
    <ArticleLayout
      title={service.title}
      description={cleanExcerpt}
      date={service.published_at ? new Date(service.published_at).getFullYear().toString() : ""}
      category={service.category}
      gradient="from-primary/20 via-primary/5 to-transparent"
      imageUrl={service.image_url}
      backHref="/"
      backLabel={labels.back}
    >
      <div
        className="tiptap-content max-w-none"
        dangerouslySetInnerHTML={{ __html: service.content }}
      />
    </ArticleLayout>
  );
}
