'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';

/**
 * Envía un `page_view` a GA4 en cada navegación soft del App Router.
 *
 * El componente <GoogleAnalytics> de @next/third-parties solo dispara
 * gtag('config') una vez al montar, por lo que las navegaciones cliente
 * (Inicio → Blog → Casos de estudio, etc.) no se registran solas. Esto lo
 * resuelve de forma determinista, sin depender de la "Medición optimizada"
 * de GA4.
 *
 * La primera vista de página ya la cuenta gtag('config') al cargar, así que
 * omitimos el primer render para no medir doble.
 */
export function GoogleAnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    sendGAEvent('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
