"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function ServicesSection() {
  const t = useTranslations("ServicesSection");

  const services = [
    {
      id: "ux-strategy",
      image: "/services/ux-strategy.png",
      title: t("service1Title"),
      description: t("service1Desc"),
    },
    {
      id: "ui-design",
      image: "/services/ui-design.png",
      title: t("service2Title"),
      description: t("service2Desc"),
    },
    {
      id: "ux-engineering",
      image: "/services/ux-engineering.png",
      title: t("service3Title"),
      description: t("service3Desc"),
    },
    {
      id: "ai-innovation",
      image: "/services/ai-innovation.png",
      title: t("service4Title"),
      description: t("service4Desc"),
    },
  ];

  return (
    <section className="w-full relative z-10 bg-background py-20 md:py-32 overflow-visible">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column (Sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full"
            >
              {/* Badge */}
              <span className="inline-block bg-muted/10 dark:bg-muted/5 border border-border/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider text-muted uppercase mb-6">
                {t("badge")}
              </span>

              {/* Title */}
              <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left mb-6">
                {t("title")}
              </h2>

              {/* Description */}
              <p className="text-muted leading-relaxed text-sm md:text-base max-w-md">
                {t("description")}
              </p>
            </motion.div>
          </div>

          {/* Right Column (Scrollable cards) */}
          <div className="lg:col-span-7 space-y-16 lg:space-y-24">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="w-full"
              >
                <Link
                  href={`/capabilities/${service.id}`}
                  className="group flex flex-col items-start w-full cursor-pointer no-underline select-none"
                >
                  {/* Image Container with high-end hover zoom and border */}
                  <div className="relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden mb-6 border border-border/30 bg-surface shadow-md">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 55vw"
                      priority={index === 0}
                    />
                    {/* Visual overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Text content */}
                  <h3 className="text-2xl md:text-3xl font-light text-foreground mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted leading-relaxed text-sm md:text-base max-w-xl">
                    {service.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
