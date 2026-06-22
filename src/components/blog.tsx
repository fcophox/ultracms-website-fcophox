import { ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { RevealImage } from "./reveal-image";
import { getTranslations, getLocale } from "next-intl/server";
import { mapArrayToLocale } from "@/utils/locale-mapper";

export async function Blog() {
  const t = await getTranslations('Blog');
  const locale = await getLocale();
  const supabase = await createClient();

  const { data: articlesData, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3);

  if (error) {
    console.error("Error fetching articles for home:", error);
  }
  
  const articles = mapArrayToLocale(articlesData || [], locale);

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
    <section className="w-full px-6 py-24 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-[clamp(1.2rem,4vw,2.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px]">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles && articles.map((article) => (
            <Link
              href={`/blog/${article.slug}`}
              key={article.id}
              className="block rounded-3xl border-none bg-surface overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-none"
              data-custom-cursor="true"
            >
              {article.image_url ? (
                <div className="relative w-full h-48">
                  <RevealImage
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover rounded-t-3xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-t-3xl" />
              )}

              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted">{formatDate(article.published_at || article.created_at)}</span>
                  <span className="text-xs font-medium text-secondary bg-secondary/10 px-2.5 py-1 rounded-full ml-auto">
                    {article.category || t('defaultCategory')}
                  </span>
                </div>

                <h3 className="text-[clamp(1rem,2.4vw,1.2rem)] font-light text-foreground leading-tight text-left w-full md:max-w-[750px] mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-2">
                  {/* Extracting pure text from HTML content or just using an excerpt logic */}
                  {article.content ? article.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...' : t('readFull')}
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
