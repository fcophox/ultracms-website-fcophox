import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artículos, reflexiones y aprendizajes sobre diseño, tecnología y desarrollo de productos digitales.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
