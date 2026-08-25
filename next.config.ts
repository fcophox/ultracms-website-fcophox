import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SLUG_REDIRECTS } from "./src/data/slug-redirects";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Biblioteca de medios de Kontorōru: portadas e imágenes del contenido.
        // URLs firmadas con 24 h de validez, no rutas permanentes.
        protocol: 'https',
        hostname: 'glepekbxevoowijfzywe.supabase.co',
      },
    ],
  },
  /**
   * Los slugs cambiaron al migrar a Kontorōru y las URLs anteriores están
   * indexadas. Sin esto quedan 12 páginas en 404.
   *
   * Van aquí y no en src/middleware.ts a propósito: se resuelven antes de que
   * el middleware corra, así que una redirección no arrastra la comprobación
   * de sesión de Supabase.
   */
  async redirects() {
    return SLUG_REDIRECTS.map(({ base, from, to }) => ({
      source: `${base}/${from}`,
      destination: `${base}/${to}`,
      permanent: true,
    }));
  },
};

export default withNextIntl(nextConfig);
