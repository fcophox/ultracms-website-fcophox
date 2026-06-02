import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function Banner() {
  const t = useTranslations('Banner');

  return (
    <section className="dark w-full px-6 py-24 z-10 relative">
      <div className="bg-background relative max-w-6xl mx-auto flex flex-col items-center text-center rounded-3xl overflow-hidden border border-border px-8 py-20 md:py-32 shadow-2xl">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
            style={{ transform: "translate3d(0, 0, 0) scale(1.1)" }}
          >
            <source src="/movie/background.mp4" type="video/mp4" />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-background/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full">
          <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-light text-foreground leading-tight text-center w-full md:max-w-[800px] mb-6">
            {t('title')}
          </h2>
          <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl">
            {t('subtitle')}
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-200 shadow-xl shadow-foreground/10"
          >
            {t('button')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
