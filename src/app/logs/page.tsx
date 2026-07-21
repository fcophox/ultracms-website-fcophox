import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Metadata } from "next";
import changelog from "@/data/changelog.json";

export const revalidate = 3600;

type ChangelogEntry = {
  date: string;
  type: "feature" | "improvement" | "fix";
  title: string;
  summary: string;
};

const entries = changelog as ChangelogEntry[];

const TYPE_STYLES: Record<ChangelogEntry["type"], string> = {
  feature: "text-primary",
  improvement: "text-secondary",
  fix: "text-emerald-500",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("logsTitle"),
    description: "Historial de novedades y mejoras del sitio.",
  };
}

export default async function LogsPage() {
  const locale = await getLocale();
  const t = await getTranslations("LogsPage");

  const formatDate = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const typeLabels: Record<ChangelogEntry["type"], string> = {
    feature: t("typeFeature"),
    improvement: t("typeImprovement"),
    fix: t("typeFix"),
  };

  const sortedEntries = [...entries].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));

  return (
    <main className="w-full overflow-x-hidden flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="max-w-3xl mx-auto px-6 w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backHome")}
          </Link>
        </div>

        <div className="mb-16">
          <h1 className="text-4xl md:text-[3.5rem] font-light text-foreground mb-8 leading-tight tracking-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
            {t("subtitle")}
          </p>
        </div>

        {sortedEntries.length === 0 ? (
          <p className="text-muted">{t("empty")}</p>
        ) : (
          <ol className="relative border-l border-border/60 ml-2">
            {sortedEntries.map((entry, index) => (
              <li key={`${entry.date}-${index}`} className="relative pl-8 pb-12 last:pb-0">
                <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-background border-2 border-primary" />

                <span className="block text-sm text-muted mb-2">{formatDate(entry.date)}</span>

                <span className={`text-xs font-medium ${TYPE_STYLES[entry.type]}`}>
                  {typeLabels[entry.type]}
                </span>
                <h2 className="text-lg font-medium text-foreground mt-1 mb-2">{entry.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{entry.summary}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
