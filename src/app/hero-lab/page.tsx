"use client";

import { useState } from "react";

import { GradientField, FIELD_DEFAULTS, type FieldParams } from "@/components/gradient-field";

/**
 * Tuning page for the hero's background field. Not linked, marked noindex.
 *
 * It renders sample hero copy over the field by default, because the only
 * question that matters here is whether the headline still reads — a background
 * judged on its own will always be tuned brighter than it should be.
 */

type Control = {
  key: keyof FieldParams;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
};

const CONTROLS: Control[] = [
  { key: "scale", label: "Escala", hint: "Bajar = manchas más amplias y calmas", min: 0.4, max: 8, step: 0.05 },
  { key: "speed", label: "Velocidad", hint: "Deriva del campo. El video original era lento", min: 0, max: 0.6, step: 0.005 },
  { key: "warp", label: "Plegado", hint: "Cuánto se dobla sobre sí mismo. 0 = ruido plano", min: 0, max: 6, step: 0.05 },
  { key: "intensity", label: "Intensidad", hint: "Cuánto color sobre el fondo de página", min: 0, max: 1.5, step: 0.01 },
  { key: "contrast", label: "Contraste", hint: "Plano contra manchas definidas", min: 0.2, max: 4, step: 0.05 },
  { key: "mixBias", label: "Mezcla", hint: "Balance entre primary y secondary", min: 0, max: 1.5, step: 0.01 },
  { key: "vignette", label: "Viñeta", hint: "Oscurece las esquinas", min: 0, max: 1.2, step: 0.01 },
  { key: "grain", label: "Grano", hint: "Rompe el bandeado de los degradados anchos", min: 0, max: 0.12, step: 0.002 },
  { key: "bottomFade", label: "Fundido inferior", hint: "Cuánto se difumina la base hacia el color de fondo", min: 0, max: 1, step: 0.01 },
  { key: "resolution", label: "Resolución", hint: "La palanca de rendimiento. 0.5 suele ser indistinguible", min: 0.15, max: 1, step: 0.05 },
];

export default function HeroLabPage() {
  const [params, setParams] = useState<FieldParams>(FIELD_DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [showCopy, setShowCopy] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);

  const set = (key: keyof FieldParams, value: number) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  const changed = (Object.keys(params) as (keyof FieldParams)[]).filter(
    (k) => params[k] !== FIELD_DEFAULTS[k],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(params, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="dark relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0">
        <GradientField params={params} />
      </div>

      {showCopy && (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/30 px-4 py-1.5 font-mono text-xs tracking-wide text-foreground/80 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>Growth Partner para crear y escalar</span>
          </div>
          <h1 className="mb-6 max-w-4xl text-4xl font-normal leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Investigación y optimización de{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              experiencias digitales
            </span>
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
            Estrategia, estética y usabilidad combinada para optimizar experiencias
            digitales que conectan personas con lo digital.
          </p>
        </div>
      )}

      <div className="fixed right-4 top-24 z-30 flex gap-2">
        <button
          onClick={() => setShowCopy((v) => !v)}
          className="rounded-full border border-border bg-surface/80 px-4 py-2 font-mono text-xs backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
        >
          {showCopy ? "Ocultar texto" : "Mostrar texto"}
        </button>
        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="rounded-full border border-border bg-surface/80 px-4 py-2 font-mono text-xs backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
        >
          {panelOpen ? "Ocultar controles" : "Mostrar controles"}
        </button>
      </div>

      {panelOpen && (
        <div className="fixed right-4 top-36 bottom-4 z-20 flex w-[330px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-background/85 backdrop-blur-xl">
          <div className="border-b border-border/60 px-5 py-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">
              Fondo del hero
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {CONTROLS.map((c) => (
              <label key={c.key} className="mb-4 block">
                <span className="flex items-baseline justify-between">
                  <span className="text-xs text-foreground">{c.label}</span>
                  <span className="font-mono text-[11px] text-primary">{params[c.key]}</span>
                </span>
                <input
                  type="range"
                  min={c.min}
                  max={c.max}
                  step={c.step}
                  value={params[c.key]}
                  onChange={(e) => set(c.key, Number(e.target.value))}
                  className="mt-1.5 w-full accent-[var(--color-primary)]"
                />
                <span className="mt-0.5 block text-[10px] leading-snug text-muted">{c.hint}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-border/60 px-5 py-3">
            <p className="mb-2 font-mono text-[10px] text-muted">
              {changed.length === 0
                ? "Sin cambios respecto a los valores actuales"
                : `${changed.length} cambiado${changed.length === 1 ? "" : "s"}: ${changed.join(", ")}`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-medium text-background transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
              >
                {copied ? "Copiado" : "Copiar valores"}
              </button>
              <button
                onClick={() => setParams(FIELD_DEFAULTS)}
                className="rounded-full border border-border px-4 py-2 text-xs transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
