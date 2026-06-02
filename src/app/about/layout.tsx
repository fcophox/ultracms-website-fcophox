import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Mí",
  description: "Conoce mi trayectoria como diseñador de producto e ingeniero front-end enfocado en crear experiencias digitales que aportan valor real.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
