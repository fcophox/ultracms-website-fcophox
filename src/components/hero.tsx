import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="dark bg-background text-foreground relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden text-center py-20">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover blur-3xl opacity-40 scale-110"
          style={{ transform: "translate3d(0, 0, 0) scale(1.1)" }} // Force GPU acceleration for better blur performance
        >
          <source src="/movie/background.mp4" type="video/mp4" />
        </video>
        {/* Overlay to ensure text readability against the video */}
        <div className="absolute inset-0 bg-background/30" />
        {/* Bottom fade gradient to blend smoothly into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground mb-6 leading-tight">
          {t('titleLine1')}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {t('titleLine2')}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-2xl mb-10 leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a
            href="/case-studies"
            className="px-8 py-3 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-foreground/20 dark:shadow-foreground/5"
          >
            {t('viewProjects')}
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-surface text-foreground font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-border/50 border border-border"
          >
            {t('visitLinkedin')}
          </a>
        </div>
      </div>
    </section>
  );
}
