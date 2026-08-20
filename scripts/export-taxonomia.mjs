/*
 * Respaldo de la taxonomía anterior: la columna `category` de cada entrada y
 * los `tags` de los casos de estudio.
 *
 * En Supabase, `category` era un valor POR ENTRADA ("Academy", "UX", "App"…) y
 * es lo que alimenta los chips de filtro de /blog y /case-studies. En Kontorōru
 * la categoría es el TIPO de contenido —`blog` o `casos-de-estudio`—, así que
 * al importar se perdió esa taxonomía: los 18 posts llegaron con `tags: []`.
 *
 * Este volcado es la lista de qué etiqueta hay que ponerle a cada post en el
 * panel para recuperar los filtros.
 *
 * Uso:
 *   node scripts/export-taxonomia.mjs > MIGRACION_TAXONOMIA.md
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  let raw = "";
  try {
    raw = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
  } catch {
    return {};
  }
  const env = {};
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const bloques = [];
for (const [tabla, label] of [["articles", "Artículos"], ["case_studies", "Casos de estudio"]]) {
  const { data, error } = await db
    .from(tabla)
    .select("title, slug, category, tags")
    .eq("status", "published")
    .order("category");

  if (error) {
    console.error(`Error leyendo ${tabla}: ${error.message}`);
    process.exit(1);
  }

  const filas = data ?? [];
  const resumen = {};
  for (const r of filas) {
    const c = r.category || "(vacío)";
    resumen[c] = (resumen[c] ?? 0) + 1;
  }

  bloques.push(
    `## ${label} (\`${tabla}\`)\n\n` +
    `Chips de filtro actuales: ` +
    Object.entries(resumen).map(([c, n]) => `**${c}** (${n})`).join(", ") + "\n\n" +
    "| título | etiqueta a poner | tags adicionales |\n|---|---|---|\n" +
    filas
      .map((r) => {
        const tags = Array.isArray(r.tags) && r.tags.length ? r.tags.join(", ") : "—";
        return `| ${(r.title ?? "").replace(/\|/g, "\\|")} | \`${r.category ?? "—"}\` | ${tags} |`;
      })
      .join("\n")
  );
}

process.stdout.write(
  `# Taxonomía previa a Kontorōru\n\n` +
  `Generado por \`scripts/export-taxonomia.mjs\` el ${new Date().toISOString()}.\n\n` +
  `La importación dejó los 18 posts con \`tags: []\`. Sin etiquetas, los chips de\n` +
  `filtro de \`/blog\` y \`/case-studies\` se quedan en un único botón y el filtro\n` +
  `deja de tener sentido.\n\n` +
  `**Para recuperarlos:** añade en el panel de Kontorōru, a cada post, la etiqueta\n` +
  `de la columna "etiqueta a poner". El código ya lee \`post.tags\` y hace\n` +
  `reaparecer los chips en cuanto existan.\n\n` +
  bloques.join("\n\n") + "\n"
);
console.error("OK — taxonomía respaldada.");
