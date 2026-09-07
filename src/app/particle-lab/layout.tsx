import type { Metadata } from "next";

/** Internal tuning tool: keep it out of search results and the sitemap. */
export const metadata: Metadata = {
  title: "Ajuste de la malla",
  robots: { index: false, follow: false },
};

export default function ParticleLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
