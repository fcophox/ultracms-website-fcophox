"use client";

import { useState } from "react";

import { ParticleWave, WAVE_DEFAULTS, type WaveParams } from "@/components/particle-wave";

/**
 * Tuning page for the particle mesh. Not linked from anywhere and marked
 * noindex — it exists so the parameters can be judged by eye instead of being
 * fitted blind, which is how every value in WAVE_DEFAULTS was arrived at.
 *
 * It drives the real <ParticleWave /> through its params prop rather than
 * holding a copy of the shader, so what you tune here is exactly what ships.
 */

type Control = {
  key: keyof WaveParams;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
};

const GROUPS: { title: string; controls: Control[] }[] = [
  {
    title: "Cámara",
    controls: [
      { key: "camDist", label: "Distancia", hint: "Bajar = acercarse. Refuerza la perspectiva", min: 2.5, max: 9, step: 0.05 },
      { key: "pitch", label: "Inclinación", hint: "Negativo mira desde arriba. Positivo invierte el plano", min: -1.2, max: 0.4, step: 0.01 },
      { key: "focal", label: "Focal", hint: "Magnifica. Suele anularse con el estiramiento", min: 0.8, max: 4, step: 0.05 },
    ],
  },
  {
    title: "Onda",
    controls: [
      { key: "amp", label: "Amplitud", hint: "Relieve: olas más pronunciadas", min: 0, max: 4, step: 0.05 },
      { key: "speed", label: "Velocidad", hint: "Agitación: no cambia el relieve", min: 0, max: 4, step: 0.05 },
    ],
  },
  {
    title: "Plano",
    controls: [
      { key: "xScale", label: "Ancho", hint: "Ensanchar sin subir columnas adelgaza la grilla", min: 1, max: 14, step: 0.1 },
      { key: "zScale", label: "Profundidad", min: 0.5, max: 7, step: 0.1, hint: "Cuánto se aleja el plano" },
      { key: "yOffset", label: "Altura", hint: "Cuánto queda el plano bajo la cámara", min: -1, max: 1.5, step: 0.01 },
      { key: "edgeStart", label: "Borde lateral", hint: "1.0 = sin degradado, sangra por los lados", min: 0.2, max: 1, step: 0.01 },
    ],
  },
  {
    title: "Encuadre",
    controls: [
      { key: "vStretch", label: "Estiramiento", hint: "Bajar si la malla se corta abajo", min: 0.2, max: 3, step: 0.01 },
      { key: "yShift", label: "Desplazamiento", hint: "Sube o baja la banda en el encuadre", min: -1, max: 1.5, step: 0.01 },
      { key: "depthFar", label: "Fundido lejano", hint: "Dónde se apagan las filas del fondo", min: 0.5, max: 8, step: 0.1 },
      { key: "depthNear", label: "Fundido cercano", hint: "Dónde se apagan las filas cercanas", min: 0.5, max: 8, step: 0.1 },
    ],
  },
  {
    title: "Puntos",
    controls: [
      { key: "pointScale", label: "Tamaño", hint: "Muy bajo y los puntos caen bajo un píxel: desaparecen", min: 1, max: 40, step: 0.5 },
      { key: "pointMin", label: "Mínimo px", min: 0.3, max: 8, step: 0.1, hint: "Piso del tamaño" },
      { key: "pointMax", label: "Máximo px", min: 1, max: 20, step: 0.5, hint: "Techo del tamaño" },
      { key: "alpha", label: "Opacidad", hint: "Opacidad máxima de cada punto", min: 0.05, max: 1, step: 0.01 },
      { key: "cols", label: "Columnas", hint: "Reconstruye la grilla", min: 40, max: 700, step: 1 },
      { key: "rows", label: "Filas", hint: "Reconstruye la grilla", min: 20, max: 320, step: 1 },
    ],
  },
];

export default function ParticleLabPage() {
  const [params, setParams] = useState<WaveParams>(WAVE_DEFAULTS);
  const [copied, setCopied] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);

  const set = (key: keyof WaveParams, value: number) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  const changed = (Object.keys(params) as (keyof WaveParams)[]).filter(
    (k) => params[k] !== WAVE_DEFAULTS[k],
  );

  const snippet = JSON.stringify(params, null, 2);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const points = params.cols * params.rows;

  return (
    <main
      className="dark relative min-h-screen w-full overflow-hidden bg-background text-foreground"
      /*
        Painted inline so it survives the frame before the stylesheet applies,
        where a class-only background renders as nothing and flashes white.
        The custom property still wins once CSS lands, so a palette change in
        DESIGN.MD carries; the literal matches --background in .dark.
      */
      style={{ backgroundColor: "var(--background, #101012)" }}
    >
      <div className="absolute inset-0">
        <ParticleWave params={params} />
      </div>

      <button
        onClick={() => setPanelOpen((o) => !o)}
        className="fixed right-4 top-24 z-30 rounded-full border border-border bg-surface/80 px-4 py-2 font-mono text-xs backdrop-blur-md transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
      >
        {panelOpen ? "Ocultar controles" : "Mostrar controles"}
      </button>

      {panelOpen && (
        <div className="fixed right-4 top-36 bottom-4 z-20 flex w-[330px] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-border bg-background/85 backdrop-blur-xl">
          <div className="flex items-baseline justify-between border-b border-border/60 px-5 py-3">
            <span className="font-mono text-xs uppercase tracking-widest text-primary">Malla</span>
            <span className="font-mono text-[10px] text-muted">
              {points.toLocaleString("es")} pts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {GROUPS.map((group) => (
              <div key={group.title} className="mb-6">
                <h3 className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {group.title}
                </h3>
                {group.controls.map((c) => (
                  <label key={c.key} className="mb-4 block">
                    <span className="flex items-baseline justify-between">
                      <span className="text-xs text-foreground">{c.label}</span>
                      <span className="font-mono text-[11px] text-primary">
                        {params[c.key]}
                      </span>
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
                    <span className="mt-0.5 block text-[10px] leading-snug text-muted">
                      {c.hint}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <div className="border-t border-border/60 px-5 py-3">
            <p className="mb-2 font-mono text-[10px] text-muted">
              {changed.length === 0
                ? "Sin cambios respecto a los valores actuales"
                : `${changed.length} valor${changed.length === 1 ? "" : "es"} cambiado${changed.length === 1 ? "" : "s"}: ${changed.join(", ")}`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={copy}
                className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-medium text-background transition-transform duration-200 hover:scale-105 active:scale-[0.97]"
              >
                {copied ? "Copiado" : "Copiar valores"}
              </button>
              <button
                onClick={() => setParams(WAVE_DEFAULTS)}
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
