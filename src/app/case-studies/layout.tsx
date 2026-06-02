import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casos de Estudio",
  description: "Selección de proyectos donde he aplicado estrategia, diseño y código para resolver problemas reales.",
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
