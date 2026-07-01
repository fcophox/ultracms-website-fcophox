"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const t = useTranslations('Footer');
  const pathname = usePathname();
  
  const isDashboard = pathname?.startsWith('/dashboard');
  const isLogin = pathname === '/login';

  if (isDashboard || isLogin) {
    return null;
  }

  return (
    <footer className="dark w-full bg-background text-foreground border-t border-border mt-auto pt-16 pb-8 relative overflow-hidden">

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Left section - Profile */}
          <div className="md:col-span-6 flex flex-col items-start">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-border/50">
                <Image
                  src="/brand/francisco-avatar.png?v=2"
                  alt="Francisco"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">Francisco</span>
                <span className="text-sm text-muted">{t('role')}</span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 mt-2">
              <span className="text-foreground font-medium">{t('projectPrompt')}</span>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-transparent hover:bg-surface border border-border/80 text-foreground text-sm font-medium transition-colors"
              >
                {t('contactMe')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Middle section - Sitemap */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-foreground mb-6">{t('sitemap')}</h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/about" className="text-muted hover:text-foreground transition-colors">{t('about')}</Link></li>
              <li><Link href="/methodology" className="text-muted hover:text-foreground transition-colors">{t('methodology')}</Link></li>
              <li><Link href="/case-studies" className="text-muted hover:text-foreground transition-colors">{t('caseStudies')}</Link></li>
              <li><Link href="/blog" className="text-muted hover:text-foreground transition-colors">{t('blog')}</Link></li>
            </ul>
          </div>

          {/* Right section - Social */}
          <div className="md:col-span-3">
            <h3 className="font-semibold text-foreground mb-6">{t('socialNetworks')}</h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a href="https://behance.net/fcophox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  {t('behance')} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/fcophox/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  {t('linkedin')} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://github.com/fcophox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  {t('github')} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a href="https://medium.com/@fcophox" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
                  {t('medium')} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-8 border-t border-border/50 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted">
            <Image src="/brand/logotipo.svg" alt="Logo" width={16} height={16} className="opacity-50 grayscale" />
            <span>fcophox.com - {t('rights')} - {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
