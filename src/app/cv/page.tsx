"use client";

import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Printer, 
  Briefcase, 
  Sparkles, 
  Compass,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);

export default function CvPage() {
  const t = useTranslations('CvPage');
  const handlePrint = () => {
    window.print();
  };

  const impactItems = t.raw('impactItems') as string[];
  const jobs = t.raw('jobs') as { title: string; company: string; tasks: string[] }[];
  const skills = t.raw('skills') as string[];
  const tools = t.raw('tools') as string[];
  const education = t.raw('education') as { title: string; institution: string }[];

  return (
    <main className="w-full min-h-screen text-foreground py-12 md:py-24 print:bg-white print:text-slate-900 print:py-0">
      {/* Print styles injection for custom page sizes, margins and ATS optimization */}
      <style jsx global>{`
        @media print {
          /* Hide normal navigation bar and footer if they are rendered by the main layout */
          header, footer, nav, .no-print {
            display: none !important;
          }
          
          body {
            background-color: white !important;
            color: #0f172a !important;
            font-size: 10pt !important;
            line-height: 1.4 !important;
          }
          
          /* Single column layout for 100% ATS readability */
          .grid {
            display: block !important;
          }
          
          .lg:col-span-8, .lg:col-span-4 {
            width: 100% !important;
            display: block !important;
            border-left: none !important;
            padding-left: 0 !important;
            margin-top: 0 !important;
          }

          /* Compact spacing to fit on exactly 2 pages */
          section {
            margin-bottom: 14pt !important;
            page-break-inside: avoid;
          }
          
          .space-y-14 {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }

          .space-y-14 > * + * {
            margin-top: 14pt !important;
          }
          
          h1 {
            font-size: 22pt !important;
            margin-bottom: 3pt !important;
            font-weight: bold !important;
          }
          
          h2 {
            font-size: 11pt !important;
            margin-top: 8pt !important;
            margin-bottom: 6pt !important;
            color: #0ea5e9 !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding-bottom: 2pt !important;
            font-weight: bold !important;
          }
          
          h3 {
            font-size: 10pt !important;
            font-weight: bold !important;
          }

          p, li, span {
            font-size: 9pt !important;
            color: #334155 !important;
          }

          /* Timeline specific compact print spacing */
          .pb-10 {
            padding-bottom: 12pt !important;
          }
          
          .space-y-10 > * + * {
            margin-top: 12pt !important;
          }

          /* Prevent break inside job blocks */
          .relative.pl-8 {
            page-break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 1.2cm 1.5cm;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 w-full print:px-0">
        
        {/* Navigation & Controls */}
        <div className="flex justify-between items-center mb-12 no-print">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backHome')}
          </Link>
          
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium text-sm transition-all duration-200 hover:scale-105 shadow-md shadow-[#0ea5e9]/20"
          >
            <Printer className="w-4 h-4" />
            {t('printPdf')}
          </button>
        </div>

        {/* CV Container */}
        <motion.article 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full print:bg-transparent print:p-0"
        >
          {/* Header */}
          <header className="border-b border-border/20 pb-8 mb-12 print:border-slate-200 print:pb-4 print:mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight print:text-slate-900">
              Francisco Hormazábal
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-[#0ea5e9] dark:text-[#38bdf8] mb-4 print:text-[#0ea5e9] print:mb-2 print:text-sm print:font-semibold">
              {t('role')}
            </p>
            
            <div className="flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider text-muted/80 print:text-slate-500 print:text-[8pt] print:mb-2">
              <span>{t('tag1')}</span>
              <span className="text-muted/30">•</span>
              <span>{t('tag2')}</span>
              <span className="text-muted/30">•</span>
              <span>{t('tag3')}</span>
              <span className="text-muted/30">•</span>
              <span>{t('tag4')}</span>
              <span className="text-muted/30">•</span>
              <span>{t('tag5')}</span>
            </div>

            {/* Print-only contact bar for ATS / Clean PDF layout */}
            <div className="hidden print:flex flex-wrap gap-x-4 gap-y-1 text-[9pt] text-slate-600 mt-3 font-light">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> Santiago, Chile</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> fcojhormazabalh@gmail.com</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-500" /> +56 9 9072 8560</span>
              <span>•</span>
              <span className="flex items-center gap-1"><LinkedinIcon className="w-3 h-3 text-slate-500" /> linkedin.com/in/fcophox</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-500" /> fcophox.com</span>
            </div>
          </header>

          {/* Grid Layout (2 Columns on Web, Stacked on Print for ATS reading order) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 print:flex print:flex-col">
            
            {/* Left Column (Main Content - 8 Cols) */}
            <div className="lg:col-span-8 space-y-14 print:space-y-6">
              
              {/* Perfil */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5 flex items-center gap-2 print:text-slate-800 print:text-xs">
                  <Compass className="w-4 h-4 print:hidden text-foreground/60" />
                  {t('profileTitle')}
                </h2>
                <p 
                  className="text-muted leading-relaxed font-light text-sm md:text-base print:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: t('profileP1') }}
                />
                <p 
                  className="text-muted leading-relaxed font-light text-sm md:text-base mt-4.5 print:text-slate-700 print:mt-2"
                  dangerouslySetInnerHTML={{ __html: t('profileP2') }}
                />
                <p 
                  className="text-muted leading-relaxed font-light text-sm md:text-base mt-4.5 print:text-slate-700 print:mt-2"
                  dangerouslySetInnerHTML={{ __html: t('profileP3') }}
                />
              </section>

              {/* Impacto */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5 flex items-center gap-2 print:text-slate-800 print:text-xs">
                  <Sparkles className="w-4 h-4 print:hidden text-foreground/60" />
                  {t('impactTitle')}
                </h2>
                <ul className="space-y-3.5 text-sm text-muted print:text-slate-700 print:space-y-1.5">
                  {impactItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 font-light">
                      <span className="text-[#0ea5e9] dark:text-[#38bdf8] font-bold select-none shrink-0 print:text-slate-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Experiencia */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-8 flex items-center gap-2 print:text-slate-800 print:text-xs">
                  <Briefcase className="w-4 h-4 print:hidden text-foreground/60" />
                  {t('experienceTitle')}
                </h2>
                <div className="relative">
                  
                  {jobs.map((job, index) => {
                    const isLast = index === jobs.length - 1;
                    const isFirst = index === 0;
                    return (
                      <div key={index} className={`relative pl-8 ${isLast ? 'print:pl-6' : 'pb-10 print:pl-6 print:pb-5'}`}>
                        {!isLast && (
                          <div className="absolute left-[11px] top-3.5 bottom-0 w-0.5 bg-border/20 print:bg-slate-200 print:left-[4px]" />
                        )}
                        <div className={`absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full print:left-[0px] ${isFirst ? 'bg-[#0ea5e9] print:bg-slate-800' : 'bg-muted-foreground/30 print:bg-slate-400'}`} />
                        <div className="flex flex-col md:flex-row md:justify-between mb-3 print:mb-1">
                          <h3 className="font-bold text-foreground text-base print:text-slate-950 print:text-[10pt]">{job.title}</h3>
                          <span className="text-xs font-mono text-muted/80 uppercase print:text-[8pt] print:text-slate-500">{job.company}</span>
                        </div>
                        <ul className="list-disc pl-4 space-y-2 text-sm text-muted font-light print:text-slate-700 print:space-y-1">
                          {job.tasks.map((task, tIdx) => (
                            <li key={tIdx}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}

                </div>
              </section>

            </div>

            {/* Right Column (Sidebar - 4 Cols on Web, stacked below on print) */}
            <div className="lg:col-span-4 space-y-14 print:space-y-6 border-l border-border/10 pl-0 lg:pl-10 print:border-none print:pl-0">
              
              {/* Contacto (Hidden on print because it is rendered inline at the top for ATS efficiency) */}
              <section className="print:hidden">
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5">
                  {t('contactTitle')}
                </h2>
                <ul className="space-y-4 text-sm text-muted">
                  <li className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 shrink-0 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    <span>Santiago, Chile</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="w-4 h-4 shrink-0 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    <a href="mailto:fcojhormazabalh@gmail.com" className="hover:text-foreground transition-colors">fcojhormazabalh@gmail.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 shrink-0 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    <a href="tel:+56990728560" className="hover:text-foreground transition-colors">+56 9 9072 8560</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <LinkedinIcon className="w-4 h-4 shrink-0 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    <a href="https://linkedin.com/in/fcophox" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">linkedin.com/in/fcophox</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-4 h-4 shrink-0 text-[#0ea5e9] dark:text-[#38bdf8]" />
                    <a href="https://fcophox.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">fcophox.com</a>
                  </li>
                </ul>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5 print:text-slate-800 print:text-xs">
                  {t('skillsTitle')}
                </h2>
                <div className="flex flex-wrap gap-2 print:gap-1.5">
                  {skills.map((skill) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-full bg-surface/50 border border-border/20 text-xs text-muted print:bg-slate-100 print:text-slate-800 print:border-none print:px-2.5 print:py-0.5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Herramientas */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5 print:text-slate-800 print:text-xs">
                  {t('toolsTitle')}
                </h2>
                <div className="flex flex-wrap gap-2 print:gap-1.5">
                  {tools.map((tool) => (
                    <span 
                      key={tool} 
                      className="px-3 py-1 rounded-full bg-[#0ea5e9]/10 border border-[#0ea5e9]/20 text-xs text-[#0ea5e9] dark:text-[#38bdf8] dark:bg-[#38bdf8]/10 dark:border-[#38bdf8]/20 print:bg-slate-100 print:text-slate-800 print:border-none print:px-2.5 print:py-0.5"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              {/* Educación */}
              <section>
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-5 print:text-slate-800 print:text-xs">
                  {t('educationTitle')}
                </h2>
                <div className="space-y-6 text-sm text-muted print:text-slate-800 print:space-y-2">
                  {education.map((edu, idx) => (
                    <div key={idx}>
                      <h4 className="font-semibold text-foreground print:text-slate-900 print:text-[10pt]">{edu.title}</h4>
                      <p className="text-xs font-mono uppercase tracking-wider print:text-[8pt] print:text-slate-500">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Keywords */}
              <section className="print:hidden">
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-wider text-foreground/70 mb-4">
                  {t('keywordsTitle')}
                </h2>
                <p className="text-xs font-mono text-muted/80 leading-relaxed">
                  UX Design · Product Design · IA · CRO · Data · UX Research · Estrategia
                </p>
              </section>

            </div>

          </div>
        </motion.article>
      </div>
    </main>
  );
}
