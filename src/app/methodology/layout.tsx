import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodología",
  description: "Conoce mi enfoque metodológico que combina UX con prácticas modernas de Product Discovery, Product Delivery y UX Engineering.",
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
