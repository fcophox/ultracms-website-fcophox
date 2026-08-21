import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArticleLayout } from "@/components/article-layout";
import { RelatedArticlesCarousel } from "@/components/related-articles-carousel";
import { CATEGORIA } from "@/utils/kontororu";
import { listarLocalizado, porSlugLocalizado } from "@/utils/kontororu-i18n";
import { aListadoArray, resumenDe } from "@/utils/kontororu-adapter";

export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await porSlugLocalizado(slug.toLowerCase());

  if (!post) {
    const t = await getTranslations("ArticlePage");
    return {
      title: t("postNotFoundTitle"),
      description: t("postNotFoundDescription"),
    };
  }

  const descripcion = resumenDe(post);

  return {
    title: post.seo?.title || post.title,
    description: descripcion,
    openGraph: {
      title: post.title,
      description: descripcion,
      url: `/blog/${post.slug}`,
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

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("ArticlePage");

  /*
   * Los slugs de Kontorōru son siempre minúsculas: `slugify` del CMS las fuerza.
   * Varias URLs antiguas llevaban mayúsculas, así que una visita con otra
   * capitalización se manda a la forma canónica con un 301.
   *
   * Esto NO puede hacerse con una entrada en `redirects()`: el `source` de
   * next.config se compara sin distinguir capitalización, de modo que la regla
   * se capturaría a sí misma y dejaría la URL correcta en un bucle infinito.
   */
  if (slug !== slug.toLowerCase()) {
    permanentRedirect(`/blog/${slug.toLowerCase()}`);
  }

  const post = await porSlugLocalizado(slug);

  /*
   * `bySlug` devuelve null tanto si no existe como si está en borrador: para
   * esta API son indistinguibles a propósito, que un borrador exista no es
   * información pública. Ambos casos son un 404.
   */
  if (!post) notFound();

  const relacionados = await listarLocalizado({
    categoria: CATEGORIA.blog,
    limit: 9, // 8 + el actual, que se descarta abajo
  });

  const items = aListadoArray(relacionados.filter((p) => p.slug !== post.slug)).slice(0, 8);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <ArticleLayout
      title={post.title}
      description={resumenDe(post)}
      date={formatDate(post.publishedAt)}
      // `category` es el tipo de contenido; el chip que se muestra es la etiqueta.
      category={post.tags[0]?.name || post.category?.name || t("blogCategory")}
      gradient="from-primary/20 via-primary/5 to-transparent"
      imageUrl={post.cover?.url}
      backHref="/blog"
      backLabel={t("backToBlog")}
      slug={post.slug}
      relatedArticlesSection={
        <RelatedArticlesCarousel
          items={items.map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            content: a.content,
            image_url: a.image_url,
            href: `/blog/${a.slug}`,
          }))}
          viewAllHref="/blog"
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
