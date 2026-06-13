"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const isDashboard = pathname?.startsWith('/dashboard');
  const isLogin = pathname === '/login';

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  if (isDashboard || isLogin) {
    return null;
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      // Turn solid only after scrolling past the hero section (which is min-h-screen)
      setScrolled(window.scrollY > window.innerHeight - 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleLanguage = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  const isHome = pathname === '/';
  const positionClass = isHome ? 'fixed' : 'sticky';
  // Force dark mode if on home, not scrolled, AND menu is not open (menu should use normal theme)
  const forceDarkMode = isHome && !scrolled && !isMenuOpen;

  const navLinks = [
    { name: t('about'), path: "/about" },
    { name: t('methodology'), path: "/methodology" },
    { name: t('caseStudies'), path: "/case-studies" },
    { name: t('blog'), path: "/blog" },
  ];

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`${forceDarkMode ? 'dark text-foreground' : 'text-foreground'} ${positionClass} top-0 w-full z-50 transition-colors duration-300 border-b ${scrolled || isMenuOpen
          ? "bg-background border-border/40 shadow-sm"
          : "bg-transparent backdrop-blur-md border-transparent"
          }`}
      >
        <nav className="relative w-full flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-3 relative z-10 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-11 h-11 rounded-full bg-[#1A1A1E] border border-border/10 flex items-center justify-center shrink-0 overflow-hidden relative">
              <Image src="/brand/logotipo.svg" alt="Logo" width={44} height={44} className="object-cover absolute transition-opacity duration-300 group-hover:opacity-0" />
              <Image src="/brand/francisco-avatar.png" alt="Avatar" width={44} height={44} className="object-cover absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col justify-center hidden sm:flex">
              <span className="font-bold text-[15px] text-foreground leading-tight">Francisco Hormazábal</span>
              <span className="text-[11px] font-semibold text-muted leading-tight mt-0.5">UX Engineer & Product Design Consultant</span>
            </div>
          </Link>

          {/* Desktop Centered Navigation Links */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-base transition-colors ${pathname === link.path || pathname?.startsWith(`${link.path}/`) ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-foreground hover:text-foreground/80 transition-colors"
            >
              <span className="text-md leading-none mt-[-2px]">文</span>
              {locale.toUpperCase()}
            </button>

            <Link href="/contact" className="hidden sm:flex items-center gap-2.5 px-5 py-2 rounded-full border border-border/60 bg-transparent hover:bg-surface transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-[15px] font-bold text-foreground">{t('contact')}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-foreground flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 w-full px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.path}
                    className={`text-3xl font-light transition-colors ${pathname === link.path || pathname?.startsWith(`${link.path}/`) ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + navLinks.length * 0.1 }}
                className="mt-8 flex flex-col items-center gap-6"
              >
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-foreground text-background transition-transform hover:scale-105"
                >
                  <span className="text-lg font-bold">{t('contact')}</span>
                </Link>

                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-bold text-muted hover:text-foreground transition-colors"
                >
                  <span className="text-xl leading-none mt-[-2px]">文</span>
                  {locale.toUpperCase()}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
