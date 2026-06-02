"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

const colors = [
  { id: 'primary', bgClass: 'bg-primary' },
  { id: 'secondary', bgClass: 'bg-secondary' },
  { id: 'accent', bgClass: 'bg-accent' },
  { id: 'background', bgClass: 'bg-background' },
  { id: 'foreground', bgClass: 'bg-foreground' },
  { id: 'surface', bgClass: 'bg-surface' },
  { id: 'border', bgClass: 'bg-border' },
  { id: 'muted', bgClass: 'bg-muted' },
];

export default function DesignSystemPage() {
  const t = useTranslations('DesignSystemPage');

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="max-w-6xl mx-auto px-6 w-full">
        {/* Top Link */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backHome')}
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">{t('title')}</h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-light max-w-3xl">{t('subtitle')}</p>
        </motion.div>

        {/* Colors - Light Mode */}
        <section className="mb-16">
          <h2 className="text-2xl font-normal text-foreground mb-8">{t('colorsLight')}</h2>
          {/* Force light background context for light swatches */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-[#f8fafc] rounded-3xl border border-border/50">
            {colors.map((color) => (
              <div key={`light-${color.id}`} className="flex flex-col gap-3">
                <div className={`w-full h-24 rounded-2xl shadow-sm border border-black/5 ${color.bgClass}`} />
                <span className="text-sm font-medium text-[#0f172a] capitalize">{t(`colorNames.${color.id}`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Colors - Dark Mode */}
        <section className="mb-24">
          <h2 className="text-2xl font-normal text-foreground mb-8">{t('colorsDark')}</h2>
          {/* Inject `.dark` to force dark mode colors in this container */}
          <div className="dark grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-background rounded-3xl border border-border">
            {colors.map((color) => (
              <div key={`dark-${color.id}`} className="flex flex-col gap-3">
                <div className={`w-full h-24 rounded-2xl shadow-sm border border-white/10 ${color.bgClass}`} />
                <span className="text-sm font-medium text-foreground capitalize">{t(`colorNames.${color.id}`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-normal text-foreground mb-8">{t('typography')}</h2>
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Sans Serif */}
            <div className="flex-1 p-8 rounded-3xl bg-surface border border-border flex flex-col gap-8">
              <div>
                <span className="text-sm text-muted font-mono uppercase tracking-wider mb-4 block">{t('typographySans')}</span>
                <div className="text-4xl font-light mb-2 text-foreground tracking-tight">Sora</div>
                <div className="text-sm text-muted font-light tracking-wide">Aa Bb Cc Dd Ee Ff Gg 0123456789</div>
              </div>
              <div className="h-px w-full bg-border" />
              <div className="flex flex-col gap-8">
                <div>
                  <div className="text-4xl md:text-5xl font-light text-foreground tracking-tight">H1 Heading</div>
                  <div className="text-xs text-muted mt-2 font-mono uppercase">Font Light / Tracking Tight</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-normal text-foreground leading-tight">H2 Heading</div>
                  <div className="text-xs text-muted mt-2 font-mono uppercase">Font Normal / Leading Tight</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-medium text-foreground">H3 Heading</div>
                  <div className="text-xs text-muted mt-2 font-mono uppercase">Font Medium</div>
                </div>
                <div>
                  <p className="text-base md:text-lg font-light text-muted leading-relaxed">
                    Body text. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                  </p>
                  <div className="text-xs text-muted mt-3 font-mono uppercase">Font Light / Text Muted / Leading Relaxed</div>
                </div>
              </div>
            </div>

            {/* Monospace */}
            <div className="flex-1 p-8 rounded-3xl bg-surface border border-border flex flex-col gap-8">
              <div>
                <span className="text-sm text-muted font-mono uppercase tracking-wider mb-4 block">{t('typographyMono')}</span>
                <div className="text-3xl font-mono mb-2 text-foreground">Geist Mono</div>
                <div className="text-sm text-muted font-mono">Aa Bb Cc Dd Ee Ff 0123456789</div>
              </div>
              <div className="h-px w-full bg-border" />
              <div className="flex flex-col gap-8 font-mono">
                <div>
                  <div className="text-sm md:text-base text-foreground bg-foreground/5 p-4 rounded-lg border border-border/50">
                    <span className="text-primary">const</span> <span className="text-secondary">designSystem</span> = <span className="text-accent">true</span>;
                  </div>
                  <div className="text-xs text-muted mt-3 font-sans font-mono uppercase">Code Block</div>
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs uppercase tracking-widest font-semibold">
                    Badge Element
                  </span>
                  <div className="text-xs text-muted mt-3 font-sans font-mono uppercase">Text XS / Tracking Widest / Font Semibold</div>
                </div>
                <div>
                  <p className="text-sm text-muted leading-relaxed">
                    &gt; This is a monospaced paragraph useful for technical notes or terminal outputs.
                  </p>
                  <div className="text-xs text-muted mt-3 font-sans font-mono uppercase">Text SM / Leading Relaxed</div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
