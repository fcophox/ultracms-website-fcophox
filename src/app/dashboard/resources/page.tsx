"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Users, Eye, TrendingUp, FolderArchive, Plus, Trophy, Copy, ArrowUpRight } from "lucide-react";

interface RecordItem {
  created_at: string;
  message_type: string;
  message: string;
}

export default function DashboardResourcesPage() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("created_at, message_type, message")
        .in("message_type", ["resource_unlock", "prompt_copy"])
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching resource data:", error);
      } else {
        setRecords(data || []);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  // Separate unlocks and copies
  const unlocks = records.filter((r) => r.message_type === "resource_unlock");
  const copies = records.filter((r) => r.message_type === "prompt_copy");

  // Determine date range based on selection for line chart
  let daysToGenerate = 7;
  if (timeRange === "30d") {
    daysToGenerate = 30;
  } else if (timeRange === "all") {
    if (unlocks.length > 0) {
      const oldestDate = new Date(unlocks[0].created_at);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - oldestDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysToGenerate = Math.max(diffDays, 7); // Show at least 7 days
    }
  }

  const selectedDays = Array.from({ length: daysToGenerate }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD
  }).reverse();

  const chartData = selectedDays.map((dateStr) => {
    const count = unlocks.filter((u) => u.created_at.startsWith(dateStr)).length;
    const [_, month, day] = dateStr.split("-");
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const label = `${parseInt(day)} ${months[parseInt(month) - 1]}`;
    return { label, count };
  });

  const totalUnlocks = unlocks.length;
  const totalCopies = copies.length;

  // Chart coordinate calculations
  const maxCount = Math.max(...chartData.map((d) => d.count), 5); // Default to at least 5 for scale
  const svgWidth = 1000;
  const svgHeight = 220;
  const paddingLeft = 55;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const points = chartData.map((d, index) => {
    const x = paddingLeft + (index * chartWidth) / (chartData.length - 1);
    const y = svgHeight - paddingBottom - (d.count / maxCount) * chartHeight;
    return { x, y, count: d.count, label: d.label };
  });

  // Construct SVG path strings
  let linePath = "";
  let areaPath = "";

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingBottom} L ${points[0].x} ${svgHeight - paddingBottom} Z`;
  }

  // Generate Y-axis grid labels (4 levels)
  const yTicks = Array.from({ length: 4 }, (_, i) => {
    return Math.round((maxCount / 3) * i);
  });

  // Calculate step logic to prevent label overlapping on X-axis
  const labelStep = Math.max(Math.ceil(chartData.length / 8), 1);

  // Group prompt copies by title and sort descending
  const promptRankingMap: Record<string, number> = {};
  copies.forEach((c) => {
    const title = c.message || "Prompt sin título";
    promptRankingMap[title] = (promptRankingMap[title] || 0) + 1;
  });

  const promptRanking = Object.entries(promptRankingMap)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 most copied prompts

  // Style helper for position medals/ranks
  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-500/20 text-amber-500 border-amber-500/30"; // Gold
      case 1:
        return "bg-slate-300/20 text-slate-300 border-slate-300/30"; // Silver
      case 2:
        return "bg-amber-700/20 text-amber-700 border-amber-700/30"; // Bronze
      default:
        return "bg-zinc-800/30 text-muted border-border/50";
    }
  };

  return (
    <div className="px-12 pb-20 pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recursos</h1>
          <p className="text-sm text-muted mt-1">Administra los archivos descargables y analiza las visitas del Prompt Library.</p>
        </div>
        
        <button className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:bg-foreground/90 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <Plus size={16} />
          Nuevo Recurso
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Top Analytics Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* KPI Card 1: PIN entries */}
            <div className="bg-surface border border-border/60 rounded-xl p-6 flex flex-col justify-between h-[120px] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted tracking-wider uppercase">Personas que agregaron el PIN</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{totalUnlocks}</span>
                <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  Activo
                </span>
              </div>
            </div>

            {/* KPI Card 2: Prompts Copied */}
            <div className="bg-surface border border-border/60 rounded-xl p-6 flex flex-col justify-between h-[120px] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted tracking-wider uppercase">Total Prompts Copiados</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Copy className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{totalCopies}</span>
                <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  En vivo
                </span>
              </div>
            </div>

            {/* KPI Card 3: Status */}
            <div className="bg-surface border border-border/60 rounded-xl p-6 flex flex-col justify-between h-[120px] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted tracking-wider uppercase">Clave de acceso activa</span>
                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-mono font-semibold text-foreground">8291 (Encapsulada)</span>
              </div>
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="bg-surface border border-border/60 rounded-xl p-6 shadow-sm">
            {/* Header section with range filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-sm font-semibold text-foreground">Frecuencia de Desbloqueo</h2>
              
              <div className="flex bg-background border border-border/50 rounded-full p-1 self-start sm:self-auto shadow-inner">
                {(["7d", "30d", "all"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                      timeRange === range
                        ? "bg-surface border border-border/50 text-foreground shadow-sm"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {range === "7d" ? "1 semana" : range === "30d" ? "1 mes" : "Todo"}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full relative">
              <div className="w-full h-[240px]">
                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines and Y labels */}
                  {yTicks.map((tickValue, i) => {
                    const y = svgHeight - paddingBottom - (tickValue / maxCount) * chartHeight;
                    return (
                      <g key={i} className="opacity-40">
                        <line
                          x1={paddingLeft}
                          y1={y}
                          x2={svgWidth - paddingRight}
                          y2={y}
                          className="stroke-border/30"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={paddingLeft - 12}
                          y={y + 4}
                          textAnchor="end"
                          className="text-[10px] font-medium fill-muted"
                        >
                          {tickValue}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area fill path */}
                  {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                  {/* Line path */}
                  {linePath && (
                    <path
                      d={linePath}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data point markers and labels */}
                  {points.map((p, i) => {
                    const showLabel = i === 0 || i === points.length - 1 || i % labelStep === 0;
                    return (
                      <g key={i} className="group/point">
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          className="fill-background stroke-primary stroke-[3px] transition-all duration-200 hover:r-7 hover:stroke-secondary cursor-pointer"
                        />
                        {/* Floating count label on hover */}
                        <text
                          x={p.x}
                          y={p.y - 12}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-foreground opacity-0 group-hover/point:opacity-100 transition-opacity duration-150 pointer-events-none"
                        >
                          {p.count}
                        </text>
                        {/* X axis labels (days) */}
                        {showLabel && (
                          <text
                            x={p.x}
                            y={svgHeight - 16}
                            textAnchor="middle"
                            className="text-[10px] font-medium fill-muted"
                          >
                            {p.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Ranking of Most Copied Prompts Section */}
          <div className="bg-surface border border-border/60 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-semibold text-foreground">Ranking de Prompts Más Copiados</h2>
            </div>

            {promptRanking.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderArchive className="w-12 h-12 text-muted/30 mb-4" strokeWidth={1.5} />
                <h3 className="text-base font-medium text-foreground mb-1">Sin copias registradas</h3>
                <p className="text-xs text-muted max-w-sm">
                  Aún no hay registros de copias en el Prompt Library. Las métricas aparecerán aquí a medida que los usuarios copien los prompts.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="border-b border-border/40 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 w-16 text-center">Posición</th>
                      <th className="px-4 py-3">Nombre del Prompt</th>
                      <th className="px-4 py-3 text-right w-32">Veces Copiado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-[13px]">
                    {promptRanking.map((item, index) => (
                      <tr key={index} className="hover:bg-surface/30 transition-colors group">
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex w-6 h-6 items-center justify-center rounded-lg text-xs font-bold border ${getRankStyle(index)}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-foreground max-w-md truncate">
                          {item.title}
                        </td>
                        <td className="px-4 py-3.5 text-right font-bold text-foreground">
                          <span className="inline-flex items-center gap-1.5 justify-end">
                            {item.count}
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-primary transition-colors" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
