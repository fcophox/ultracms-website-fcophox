"use client";

import { motion } from "framer-motion";
import { Search, PenTool, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function MethodologySchema() {
  const t = useTranslations('MethodologySchema');

  const steps = [
    {
      number: "01",
      title: "DISCOVER & FRAME",
      subtitle: t('step1Subtitle'),
      icon: Search,
      color: "text-emerald-400",
      bgLight: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
      items: t.raw('step1Items') as string[],
      output: t.raw('step1Output') as string[],
    },
    {
      number: "02",
      title: "DESIGN & BUILD",
      subtitle: t('step2Subtitle'),
      icon: PenTool,
      color: "text-blue-400",
      bgLight: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      items: t.raw('step2Items') as string[],
      output: t.raw('step2Output') as string[],
    },
    {
      number: "03",
      title: "VALIDATE & SCALE",
      subtitle: t('step3Subtitle'),
      icon: BarChart3,
      color: "text-purple-400",
      bgLight: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
      items: t.raw('step3Items') as string[],
      output: t.raw('step3Output') as string[],
    },
  ];

  return (
    <section className="w-full mt-16 mb-24 relative">
      <div className="text-center mb-16">
        <h2 className="text-2xl md:text-3xl font-light text-muted-foreground">
          {t('mainSubtitle')}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="flex-1 flex flex-col bg-surface rounded-3xl p-8 border-none relative z-10"
          >
            {/* Header */}
            <div className="flex flex-col mb-8">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${step.bgLight}`}>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <h3 className={`text-xl font-medium tracking-wide mb-2 ${step.color}`}>
                {step.title}
              </h3>
              <p className="text-sm font-light text-muted leading-relaxed">
                {step.subtitle}
              </p>
            </div>

            {/* List */}
            <div className="flex-1 mb-8">
              <ul className="space-y-4">
                {step.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${step.color} opacity-70`} />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Output */}
            <div className="mt-auto pt-6 border-t border-border/10">
              <div className="text-[9px] font-semibold text-muted tracking-widest mb-3 uppercase">
                {t('outputLabel')}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                {step.output.map((out, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-background/60 border-none whitespace-nowrap">
                    {out}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resultados para el cliente */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="mt-16 md:mt-24 flex flex-col items-center justify-center w-full"
      >
        <h3 className="text-2xl font-light text-foreground mb-10">{t('resultsTitle')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {(t.raw('results') as string[]).map((text, idx) => (
            <div key={idx} className="bg-surface rounded-3xl p-8 flex flex-col items-center text-center hover:scale-[1.02] transition-transform duration-300">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <span className="text-foreground/90 font-medium text-[15px] leading-snug">
                {text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
