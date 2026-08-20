/*
 * Respaldo de la taxonomía anterior: la columna `category` de cada entrada y
 * los `tags` de los casos de estudio.
 *
 * En Supabase, `category` era un valor POR ENTRADA ("Academy", "UX", "App"…) y
 * es lo que alimenta los chips de filtro de /blog y /case-studies. En Kontorōru
 * la categoría es el TIPO de contenido —`blog` o `casos-de-estudio`—, así que
 * al importar se perdió esa taxonomía: los 18 posts llegaron con `tags: []`.
 *
 * Su sitio natural serían las etiquetas, pero el panel de Kontorōru TODAVÍA NO
 * permite asignarlas: `tags` y `post_tags` están en el esquema y la API las
 * lee, pero no hay ninguna escritura en el código del CMS. Hasta que la haya,
 * el puente es un campo personalizado, que el editor sí soporta.
 *
 * Este volcado es la lista de qué valor ponerle a cada post.
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
    "| título | valor de `categoria` | tags adicionales (para cuando existan) |\n|---|---|---|\n" +
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
  `La importación dejó los 18 posts con \`tags: []\`, así que los chips de filtro de\n` +
  `\`/blog\` y \`/case-studies\` se quedan en un único valor. Con uno solo el filtro\n` +
  `no filtra nada, así que **la web lo esconde** en lugar de mostrar un control\n` +
  `inerte.\n\n` +
  `> ⚠️ **El panel de Kontorōru todavía no permite asignar etiquetas.** Las tablas\n` +
  `> \`tags\` y \`post_tags\` existen y la API las lee —incluso acepta \`?tag=\` como\n` +
  `> filtro—, pero no hay ninguna escritura sobre ellas en el código del CMS.\n\n` +
  `**Para recuperar los chips hoy:** en cada post, en **Campos personalizados**,\n` +
  `añade la clave \`categoria\` con el valor de la tabla de abajo.\n\n` +
  `El adaptador lo lee en este orden:\n\n` +
  `1. \`customFields.categoria\` — lo que funciona hoy\n` +
  `2. \`tags[0].name\` — cuando el CMS permita etiquetas, mandan solas\n` +
  `3. \`category.name\` — respaldo\n\n` +
  `Cuando lleguen las etiquetas, el campo personalizado se puede retirar sin\n` +
  `tocar código.\n\n` +
  bloques.join("\n\n") + "\n"
);
console.error("OK — taxonomía respaldada.");
