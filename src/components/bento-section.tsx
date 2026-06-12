"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Search, PenTool, Terminal, Rocket, Lightbulb, Zap, LineChart, Send } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function BentoSection() {
  const t = useTranslations('BentoSection');
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2500);

    const tabInterval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tabInterval);
    };
  }, []);

  return (
    <section className="w-full relative z-10 bg-background overflow-visible py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1: Estrategia (Top Left, spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-3xl bg-surface border-none p-8 md:p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
              <Image src="/methodology/bg-card-1.svg" alt="Background Estrategia" fill className="object-cover" />
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none transition-transform duration-700 group-hover:scale-110 z-0" />

            <div className="z-10 mb-12">
              <h3 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-4">
                {t('card1Title')}
              </h3>
              <p className="text-muted text-sm md:text-base max-w-md">
                {t('card1Desc')}
              </p>
            </div>

            {/* Stepper */}
            <div className="z-10 flex items-center justify-between relative mt-auto pt-8">
              {/* Line behind steps */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border -translate-y-1/2 -z-10" />

              {[
                { icon: Search, title: t('step1') },
                { icon: PenTool, title: t('step2') },
                { icon: Terminal, title: t('step3') },
                { icon: Rocket, title: t('step4') }
              ].map((step, idx) => {
                const isActive = activeStep === idx;
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500 ${isActive ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]' : 'border-border bg-surface hover:border-primary/50'}`}>
                      <Icon size={20} className={`transition-colors duration-500 ${isActive ? 'text-primary' : 'text-muted'}`} />
                    </div>
                    <span className={`text-xs font-medium px-2 rounded-full border transition-all duration-500 ${isActive ? 'text-foreground bg-surface/80 border-primary/30' : 'text-muted border-transparent bg-transparent'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 2: IA (Top Right, spans 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 rounded-3xl bg-surface border-none p-8 flex flex-col justify-between overflow-hidden relative group h-[400px] md:h-[450px]"
          >
            <div className="absolute inset-0 z-0 opacity-40 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none">
              <Image src="/methodology/bg-card-ia.png" alt="Background IA" fill className="object-cover" />
            </div>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent opacity-50 pointer-events-none z-0" />

            <h3 className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-8 z-10">
              {t('card2Title')}
            </h3>

            <div className="mt-auto z-10 flex flex-col items-start gap-12">
              <Link href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
                {t('viewArticle')} <ArrowUpRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Card 3: Servicios (Bottom Left, spans 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 rounded-3xl bg-surface border-none p-8 overflow-hidden relative group flex flex-col h-[400px] md:h-[450px]"
          >
            <div className="absolute inset-0 z-0 opacity-30 transition-opacity duration-700 group-hover:opacity-50 pointer-events-none">
              <Image src="/methodology/bg-card-3.svg" alt="Background Servicios" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0" />

            <h3 className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-6 z-10 relative shrink-0">
              {t('card3Title')}
            </h3>

            <div className="relative z-10 flex-1 min-h-0 -mx-8 sm:-mx-10 overflow-hidden flex flex-col justify-start [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] pt-2 top-8 left-1 [transform:perspective(190px)_rotateY(-6deg)_rotate(9deg)_scale(1.1)] transition-transform duration-1000 ease-out">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 25,
                }}
                className="flex flex-col gap-3 w-full"
              >
                {[
                  t('serv1'),
                  t('serv2'),
                  t('serv3'),
                  t('serv4'),
                  t('serv5'),
                  t('serv6'),
                  t('serv7'),
                  // Duplicado para crear el loop infinito suavemente
                  t('serv1'),
                  t('serv2'),
                  t('serv3'),
                  t('serv4'),
                  t('serv5'),
                  t('serv6'),
                  t('serv8')
                ].map((service, i) => (
                  <div
                    key={i}
                    className="bg-background/30 backdrop-blur-sm text-muted font-medium text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all duration-300 hover:bg-surface hover:text-foreground hover:border-primary/30 w-full shrink-0"
                  >
                    {service}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Card 4: Metodologia (Bottom Right, spans 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 rounded-3xl bg-surface border-none p-8 md:p-10 flex flex-col relative overflow-hidden group"
          >
            <div className="z-10 mb-8 max-w-xl">
              <h3 className="text-[clamp(1.1rem,2.5vw,1.6rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-4">
                {t('card4Title')}
              </h3>
              <p className="text-muted text-sm md:text-base">
                {t('card4Desc')}
              </p>
            </div>

            <div className="z-10 mt-auto bg-background/25 border border-border/50 rounded-2xl p-5 md:p-8 w-full">
              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-6">
                <button
                  onClick={() => setActiveTab(0)}
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 0 ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]' : 'bg-surface border border-border text-muted hover:border-primary/50'}`}
                >
                  <Lightbulb size={14} className="md:w-4 md:h-4" /> {t('tab1')}
                </button>
                <button
                  onClick={() => setActiveTab(1)}
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 1 ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]' : 'bg-surface border border-border text-muted hover:border-primary/50'}`}
                >
                  <Zap size={14} className="md:w-4 md:h-4" /> {t('tab2')}
                </button>
                <button
                  onClick={() => setActiveTab(2)}
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 2 ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]' : 'bg-surface border border-border text-muted hover:border-primary/50'}`}
                >
                  <LineChart size={14} className="md:w-4 md:h-4" /> {t('tab3')}
                </button>
                <button
                  onClick={() => setActiveTab(3)}
                  className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all ${activeTab === 3 ? 'bg-primary/10 border border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]' : 'bg-surface border border-border text-muted hover:border-primary/50'}`}
                >
                  <Send size={14} className="md:w-4 md:h-4" /> {t('tab4')}
                </button>
              </div>

              <div className="mb-6">
                <p className="text-foreground font-medium text-base md:text-lg">
                  {activeTab === 0 && t('tab1Desc')}
                  {activeTab === 1 && t('tab2Desc')}
                  {activeTab === 2 && t('tab3Desc')}
                  {activeTab === 3 && t('tab4Desc')}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium text-sm">
                  {t('viewMore')} <ArrowUpRight size={16} />
                </Link>

                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeTab === dot ? 'w-4 bg-foreground' : 'w-1.5 bg-border'}`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
