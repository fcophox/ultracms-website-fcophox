import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Banner() {
  const t = useTranslations('Banner');

  return (
    <section className="w-full px-6 py-24 z-10 relative">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-secondary/10 border border-border px-8 py-16 md:py-20">
        <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-center w-full md:max-w-[750px] mb-4">
          {t('title')}
        </h2>
        <p className="text-muted leading-relaxed mb-8 max-w-lg">
          {t('subtitle')}
        </p>
        <a
          href="/contacto"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-foreground/20"
        >
          {t('button')}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
