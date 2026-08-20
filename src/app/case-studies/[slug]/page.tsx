import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { RelatedArticlesCarousel } from "@/components/related-articles-carousel";
import { kontororu, CATEGORIA } from "@/utils/kontororu";
import { aListadoArray, resumenDe } from "@/utils/kontororu-adapter";

export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await kontororu.posts.bySlug(slug);

  if (!post) {
    return {
      title: "Caso de estudio no encontrado",
      description: "Este caso de estudio no existe o ha sido eliminado.",
    };
  }

  const descripcion = resumenDe(post);

  return {
    title: post.seo?.title || post.title,
    description: descripcion,
    openGraph: {
      title: post.title,
      description: descripcion,
      url: `/case-studies/${post.slug}`,
      type: "article",
      siteName: "Fcophox",
      images: post.cover
        ? [{ url: post.cover.url, width: post.cover.width, height: post.cover.height, alt: post.cover.alt ?? post.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: descripcion,
      images: post.cover ? [post.cover.url] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await kontororu.posts.bySlug(slug);

  /*
   * `bySlug` devuelve null tanto si no existe como si está en borrador: para
   * esta API son indistinguibles a propósito, que un borrador exista no es
   * información pública. Ambos casos son un 404.
   */
  if (!post) notFound();

  const { data: relacionados } = await kontororu.posts.list({
    categoria: CATEGORIA.casosDeEstudio,
    limit: 9, // 8 + el actual, que se descarta abajo
  });

  const items = aListadoArray(relacionados.filter((p) => p.slug !== post.slug)).slice(0, 8);

  // Los casos de estudio muestran sólo el año, no la fecha completa.
  const formatYear = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

  return (
    <ArticleLayout
      title={post.title}
      description={resumenDe(post)}
      date={formatYear(post.publishedAt)}
      // `category` es el tipo de contenido; el chip que se muestra es la etiqueta.
      category={post.tags[0]?.name || post.category?.name || "Caso de estudio"}
      gradient="from-secondary/20 via-secondary/5 to-transparent"
      imageUrl={post.cover?.url}
      backHref="/case-studies"
      backLabel="Volver al Portafolio"
      slug={post.slug}
      relatedArticlesSection={
        <RelatedArticlesCarousel
          items={items.map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            content: a.content,
            image_url: a.image_url,
            href: `/case-studies/${a.slug}`,
          }))}
          viewAllHref="/case-studies"
        />
      }
    >
      {/*
        El HTML llega saneado desde el servidor de Kontorōru, con allowlist de
        etiquetas y atributos aplicada al guardar. La alternativa es recorrer
        `post.content.json` y renderizar componentes propios.
      */}
      <div
        className="tiptap-content max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.html }}
      />
    </ArticleLayout>
  );
}
