import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 0; // Disable caching for the admin dashboard so it's always real-time

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch counts from Supabase
  const { count: articlesCount, error: articlesCountError } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const { count: caseStudiesCount, error: caseStudiesCountError } = await supabase
    .from("case_studies")
    .select("*", { count: "exact", head: true });

  const { count: servicesCount, error: servicesCountError } = await supabase
    .from("services")
    .select("*", { count: "exact", head: true });

  if (articlesCountError) console.error("Error fetching articles count:", articlesCountError);
  if (caseStudiesCountError) console.error("Error fetching case studies count:", caseStudiesCountError);
  if (servicesCountError) console.error("Error fetching services count:", servicesCountError);

  // Fetch top articles by likes
  const { data: topArticles, error: topArticlesError } = await supabase
    .from("articles")
    .select("title, category, likes, image_url")
    .order("likes", { ascending: false })
    .limit(10);

  // Fetch top case studies by likes
  const { data: topCaseStudies, error: topCaseStudiesError } = await supabase
    .from("case_studies")
    .select("title, category, likes, image_url")
    .order("likes", { ascending: false })
    .limit(10);

  if (topArticlesError) console.error("Error fetching top articles:", topArticlesError);
  if (topCaseStudiesError) console.error("Error fetching top case studies:", topCaseStudiesError);

  // Combine and sort by likes
  const allContent = [
    ...(topArticles || []).map(a => ({ ...a, categoryType: "Article" })),
    ...(topCaseStudies || []).map(c => ({ ...c, categoryType: "Case Study" })),
  ];

  const sortedTopContent = allContent
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 10);

  const fallbackImage = "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=100&h=100&q=80";

  return (
    <div className="px-12 pb-20 pt-4">
      {/* Content Summary */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-foreground mb-6">Content Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border/60 rounded-xl overflow-hidden bg-surface">
          <div className="p-6 border-b md:border-b-0 md:border-r border-border/60 flex flex-col justify-between h-[120px]">
            <span className="text-xs font-medium text-muted">Total Articles</span>
            <span className="text-[28px] font-semibold text-foreground">{articlesCount ?? 0}</span>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-border/60 flex flex-col justify-between h-[120px]">
            <span className="text-xs font-medium text-muted">Total Case Studies</span>
            <span className="text-[28px] font-semibold text-foreground">{caseStudiesCount ?? 0}</span>
          </div>
          <div className="p-6 flex flex-col justify-between h-[120px]">
            <span className="text-xs font-medium text-muted">Total Services</span>
            <span className="text-[28px] font-semibold text-foreground">{servicesCount ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Top Content by Likes */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-6">Top Content by Likes</h2>
        <div className="border border-border/60 rounded-xl bg-surface overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_120px_80px] gap-4 px-6 py-4 border-b border-border/60 bg-surface">
            <div className="col-span-2 text-xs font-medium text-muted">Title</div>
            <div className="text-xs font-medium text-muted">Category</div>
            <div className="text-xs font-medium text-muted text-right pr-4">Likes</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/60">
            {sortedTopContent.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted/80">
                No items have any likes yet.
              </div>
            ) : (
              sortedTopContent.map((item, index) => (
                <div key={index} className="grid grid-cols-[40px_1fr_120px_80px] items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                  <div className="w-10 h-10 rounded overflow-hidden relative border border-border">
                    <Image 
                      src={item.image_url || fallbackImage} 
                      alt={item.title} 
                      fill 
                      className="object-cover" 
                      sizes="40px" 
                    />
                  </div>
                  <div className="text-[13px] text-foreground/90 font-medium truncate pr-4">
                    {item.title}
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-surface/50 text-foreground/80 border border-border/80">
                      {item.categoryType === "Article" ? "Artículo" : "Caso de Estudio"}
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-foreground text-right pr-4">
                    {item.likes ?? 0}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
