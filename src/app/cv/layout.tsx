import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV | Francisco Hormazábal - UX Engineer & Product Design Consultant",
  description: "CV de Francisco Hormazábal - Product Designer & UX Leader con más de 14 años de experiencia diseñando y escalando productos digitales.",
};

export default function CvLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
