"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageCircle, Users, CalendarCheck } from "lucide-react";
import { MessageForm, ConsultingForm, MeetingForm } from "@/components/contact-forms";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const [activeForm, setActiveForm] = useState<"none" | "message" | "consulting" | "meeting">("none");
  const formRef = useRef<HTMLDivElement>(null);

  const formHeaders = {
    message: { title: t('msgFormTitle'), icon: MessageCircle, color: "text-[#8B5CF6]" },
    consulting: { title: t('consultFormTitle'), icon: Users, color: "text-[#8B5CF6]" },
    meeting: { title: t('meetFormTitle'), icon: CalendarCheck, color: "text-[#8B5CF6]" },
  };

  useEffect(() => {
    if (activeForm !== "none" && formRef.current) {
      // Esperamos 400ms para que la animación de framer-motion (height) termine y el DOM tenga la altura completa
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  }, [activeForm]);

  const getCardClasses = (formType: string) => {
    const isActive = activeForm === formType;
    return `text-left group flex flex-col p-8 rounded-3xl bg-surface transition-all duration-300 relative overflow-hidden min-h-[320px] border ${isActive
      ? "border-primary shadow-[0_0_30px_rgba(139,92,246,0.15)] ring-1 ring-primary/50"
      : "border-border/10 hover:border-primary/50"
      }`;
  };

  const getIconContainerClasses = (formType: string) => {
    const isActive = activeForm === formType;
    return `w-12 h-12 rounded-xl flex items-center justify-center mb-12 transition-all duration-300 ${isActive
      ? "bg-primary/20 border border-primary/30 scale-110"
      : "bg-surface/50 border border-border/10 group-hover:scale-110"
      }`;
  };

  const getIconClasses = (formType: string) => {
    const isActive = activeForm === formType;
    return `transition-colors ${isActive ? "text-primary" : "text-muted group-hover:text-primary"}`;
  };

  const getTitleClasses = (formType: string) => {
    const isActive = activeForm === formType;
    return `text-xl font-medium mb-4 pr-8 transition-colors ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`;
  };

  const getIndicatorClasses = (formType: string) => {
    const isActive = activeForm === formType;
    return `absolute top-6 right-6 w-6 h-6 rounded-full border transition-all flex items-center justify-center ${isActive
      ? "border-primary bg-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"
      : "border-muted/20 group-hover:border-primary/50"
      }`;
  };

  return (
    <main className="w-full min-h-screen flex flex-col pt-8 pb-32 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 w-full">

        {/* Top Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backHome')}
          </Link>
        </motion.div>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 max-w-6xl"
        >
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">
            {t('title1')} <span className="text-primary font-normal">{t('title2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Options Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-medium text-center text-foreground mb-12">
            {t('helpTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <button onClick={() => setActiveForm("message")} className={getCardClasses("message")}>
              <div className={getIndicatorClasses("message")}>
                {activeForm === "message" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              <div className={getIconContainerClasses("message")}>
                <MessageCircle className={getIconClasses("message")} size={24} />
              </div>

              <h3 className={getTitleClasses("message")} dangerouslySetInnerHTML={{ __html: t.raw('msgCardTitle') }} />

              <p className="text-muted/80 text-sm leading-relaxed mt-auto">
                {t('msgCardDesc')}
              </p>
            </button>

            {/* Card 2 */}
            <button onClick={() => setActiveForm("consulting")} className={getCardClasses("consulting")}>
              <div className={getIndicatorClasses("consulting")}>
                {activeForm === "consulting" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              <div className={getIconContainerClasses("consulting")}>
                <Users className={getIconClasses("consulting")} size={24} />
              </div>

              <h3 className={getTitleClasses("consulting")} dangerouslySetInnerHTML={{ __html: t.raw('consultCardTitle') }} />

              <p className="text-muted/80 text-sm leading-relaxed mt-auto">
                {t('consultCardDesc')}
              </p>
            </button>

            {/* Card 3 */}
            <button onClick={() => setActiveForm("meeting")} className={getCardClasses("meeting")}>
              <div className={getIndicatorClasses("meeting")}>
                {activeForm === "meeting" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              <div className={getIconContainerClasses("meeting")}>
                <CalendarCheck className={getIconClasses("meeting")} size={24} />
              </div>

              <h3 className={getTitleClasses("meeting")} dangerouslySetInnerHTML={{ __html: t.raw('meetCardTitle') }} />

              <p className="text-muted/80 text-sm leading-relaxed mt-auto">
                {t('meetCardDesc')}
              </p>
            </button>
          </div>
        </div>

        {/* Form Section */}
        <AnimatePresence mode="wait">
          {activeForm !== "none" && (
            <motion.div
              key={activeForm}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div ref={formRef} className="max-w-3xl mx-auto w-full pt-16 pb-8 scroll-mt-32">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-surface/80 border border-border/10 flex items-center justify-center">
                      {activeForm === "message" && <MessageCircle className="text-[#8B5CF6]" size={24} />}
                      {activeForm === "consulting" && <Users className="text-[#8B5CF6]" size={24} />}
                      {activeForm === "meeting" && <CalendarCheck className="text-[#8B5CF6]" size={24} />}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium text-foreground">
                      {activeForm && formHeaders[activeForm].title}
                    </h2>
                  </div>

                  <button
                    onClick={() => setActiveForm("none")}
                    className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors font-medium text-sm self-start sm:self-auto bg-surface/50 hover:bg-surface px-4 py-2 rounded-full border border-border/10"
                  >
                    {t('hide')}
                  </button>
                </div>

                {activeForm === "message" && <MessageForm />}
                {activeForm === "consulting" && <ConsultingForm />}
                {activeForm === "meeting" && <MeetingForm />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
