import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { FileText, Briefcase } from "lucide-react";

export const revalidate = 0; // Disable caching for the admin dashboard so it's always real-time

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get current user details dynamically
  const { data: { user } } = await supabase.auth.getUser();
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Francisco";
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);

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

  return (
    <div className="px-12 pb-24 pt-12">
      {/* Greeting Header */}
      <div className="mb-12">
        <span className="text-[14.5px] font-medium text-muted/70 block mb-1">
          Hola, <span className="text-foreground/90 font-semibold">{capitalizedUserName}</span>, te damos la bienvenida
        </span>
      </div>

      {/* Top Content by Likes */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-6">Contenido Popular</h2>
        <div className="border border-border/40 rounded-2xl bg-surface overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_120px_80px] gap-4 px-6 py-4 border-b border-border/40 bg-surface/35">
            <div className="col-span-2 text-[13.5px] font-semibold text-muted">Título</div>
            <div className="text-[13.5px] font-semibold text-muted">Colección</div>
            <div className="text-[13.5px] font-semibold text-muted text-right pr-4">Likes</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border/20">
            {sortedTopContent.length === 0 ? (
              <div className="px-6 py-8 text-center text-[14px] text-muted">
                Ningún contenido ha recibido likes aún.
              </div>
            ) : (
              sortedTopContent.map((item, index) => (
                <div key={index} className="grid grid-cols-[44px_1fr_120px_80px] items-center gap-4 px-6 py-4 hover:bg-surface/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-border bg-background flex items-center justify-center shrink-0">
                    {item.image_url ? (
                      <Image 
                        src={item.image_url} 
                        alt={item.title} 
                        fill 
                        className="object-cover" 
                        sizes="40px" 
                      />
                    ) : item.categoryType === "Article" ? (
                      <FileText className="w-5 h-5 text-muted" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-muted" />
                    )}
                  </div>
                  <div className="text-[14.5px] text-foreground font-medium truncate pr-4">
                    {item.title}
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-semibold bg-muted/10 text-muted border border-border/30">
                      {item.categoryType === "Article" ? "Artículo" : "Caso"}
                    </span>
                  </div>
                  <div className="text-[14.5px] font-bold text-foreground text-right pr-4">
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
