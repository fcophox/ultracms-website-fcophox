import type { Metadata } from "next";
import { Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeShortcut } from "@/components/theme-shortcut";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://fcophox.com'),
    title: {
      default: t('defaultTitle'),
      template: t('templateTitle'),
    },
    description: "Portafolio de Fcophox, consultor especializado en UX/UI, diseño de producto e ingeniería Frontend para crear experiencias digitales con impacto real.",
    openGraph: {
      title: t('defaultTitle'),
      description: "Portafolio de Fcophox, consultor especializado en UX/UI, diseño de producto e ingeniería Frontend para crear experiencias digitales con impacto real.",
      url: "/",
      siteName: "fcoPhox",
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "fcoPhox - UX Engineer & Product Design Consultant",
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t('defaultTitle'),
      description: "Portafolio de Fcophox, consultor especializado en UX/UI, diseño de producto e ingeniería Frontend para crear experiencias digitales con impacto real.",
      images: ["/og-image.jpg"],
    },
  };
}

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sora.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <CustomCursor />
            <Navbar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Footer />
            <ThemeShortcut />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
