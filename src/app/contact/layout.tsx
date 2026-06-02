import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Iniciemos la comunicación. Si tienes una pregunta, idea de negocio o proyecto en mente, contáctame y comencemos a construir juntos.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
