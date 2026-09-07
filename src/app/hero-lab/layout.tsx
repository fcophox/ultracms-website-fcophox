import type { Metadata } from "next";

/** Internal tuning tool: keep it out of search results and the sitemap. */
export const metadata: Metadata = {
  title: "Ajuste del fondo del hero",
  robots: { index: false, follow: false },
};

export default function HeroLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
