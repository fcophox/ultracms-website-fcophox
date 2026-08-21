import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RevealImage } from "./reveal-image";
import { getTranslations, getLocale } from "next-intl/server";
import { CATEGORIA } from "@/utils/kontororu";
import { listarLocalizado } from "@/utils/kontororu-i18n";
import { aListadoArray } from "@/utils/kontororu-adapter";

export async function Blog() {
  const t = await getTranslations('Blog');
  const locale = await getLocale();

  const posts = await listarLocalizado({
    categoria: CATEGORIA.blog,
    limit: 3,
  });

  const articles = aListadoArray(posts);

  // Date formatter
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="w-full py-24 z-10 relative">
      <div className="dm-container">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-normal text-foreground leading-tight text-left w-full md:max-w-[750px]">
            {t('title')}
          </h2>

          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-muted hover:text-foreground transition-colors font-medium"
          >
            {t('viewAll')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="dm-grid">
          {articles && articles.map((article) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.id}
              className="col-span-4 block group cursor-none flex flex-col"
              data-custom-cursor="true"
            >
              {article.image_url ? (
                <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-4">
                  <RevealImage
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl mb-4 transition-transform duration-500 group-hover:scale-105" />
              )}

              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-muted">{formatDate(article.published_at || article.created_at)}</span>
                  {/* <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full ml-auto">
                    {article.category || t('defaultCategory')}
                  </span> */}
                </div>

                <h3 className="text-[clamp(1rem,2.4vw,1.3rem)] font-normal text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-base text-muted leading-relaxed line-clamp-2">
                  {/* `content` ya es el excerpt que escribió el editor, no HTML. */}
                  {article.content || t('readFull')}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/blog"
          className="sm:hidden flex items-center justify-center gap-2 mt-8 text-muted hover:text-foreground transition-colors font-medium"
        >
          {t('viewAll')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
