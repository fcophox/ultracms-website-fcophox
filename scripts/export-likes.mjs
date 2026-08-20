/*
 * Respaldo de los contadores de "me gusta" antes de migrar a Kontorōru.
 *
 * El complemento Reacciones no admite sembrar valores iniciales: el contador
 * sólo sube y sólo se pone a cero desde el panel. En cuanto /api/likes deje de
 * escribir en Supabase, estos números no se pueden recuperar de ningún sitio,
 * así que se vuelcan aquí antes de tocar nada.
 *
 * Uso:
 *   node scripts/export-likes.mjs > MIGRACION_LIKES.md
 *
 * Escribe a stdout a propósito: el respaldo no debe depender de que el script
 * acierte con la ruta, y redirigir deja al operador decidir dónde guarda.
 * Los avisos van a stderr para no ensuciar el Markdown.
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/*
 * .env.local se lee a mano: este script se ejecuta con `node`, fuera de Next,
 * que es quien normalmente carga ese archivo.
 */
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
    if (!m) continue;
    env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = { ...loadEnv(), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
    "Se leen de .env.local o del entorno."
  );
  process.exit(1);
}

const db = createClient(url, key);

/*
 * Las dos tablas que tienen columna `likes`, según src/app/api/likes/route.ts.
 * El slug es la clave con la que se identificará el contenido en Kontorōru:
 * los ids de Supabase no sobreviven a la migración.
 */
const TABLES = [
  { name: "articles", label: "Artículos" },
  { name: "case_studies", label: "Casos de estudio" },
];

let total = 0;
const bloques = [];

for (const { name, label } of TABLES) {
  const { data, error } = await db
    .from(name)
    .select("slug, slug_en, title, likes")
    .order("likes", { ascending: false, nullsFirst: false });

  if (error) {
    console.error(`Error leyendo ${name}: ${error.message}`);
    process.exit(1);
  }

  const filas = (data ?? []).map((r) => ({
    slug: r.slug ?? "(sin slug)",
    slugEn: r.slug_en ?? "",
    title: (r.title ?? "").replace(/\|/g, "\\|"),
    likes: r.likes ?? 0,
  }));

  const suma = filas.reduce((a, f) => a + f.likes, 0);
  total += suma;

  bloques.push(
    `## ${label} (\`${name}\`)\n\n` +
    `${filas.length} entradas, ${suma} reacciones en total.\n\n` +
    "| slug | slug_en | título | likes |\n|---|---|---|---:|\n" +
    (filas.length
      ? filas.map((f) => `| \`${f.slug}\` | ${f.slugEn ? `\`${f.slugEn}\`` : "—"} | ${f.title} | ${f.likes} |`).join("\n")
      : "| — | — | _(sin entradas)_ | — |")
  );
}

const ahora = new Date().toISOString();

process.stdout.write(
  `# Respaldo de reacciones previo a Kontorōru\n\n` +
  `Generado por \`scripts/export-likes.mjs\` el ${ahora}.\n\n` +
  `**${total} reacciones en total.** El complemento Reacciones de Kontorōru\n` +
  `arranca de cero: estos números no se migran solos y no se pueden sembrar\n` +
  `por API. Esta tabla es el único registro que quedará de ellos.\n\n` +
  bloques.join("\n\n") + "\n"
);

console.error(`OK — ${total} reacciones respaldadas.`);
