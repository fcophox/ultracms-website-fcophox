/*
 * Guard de build: los estilos de los artículos del CMS se rompieron varias
 * veces porque vivían en globals.css, que scripts/sync-design.mjs regenera.
 * Este check hace fallar el build si la protección actual se desarma:
 *  1. src/app/tiptap-content.css debe existir y definir .tiptap-content
 *  2. src/app/layout.tsx debe importarlo
 *  3. globals.css no debe contener reglas .tiptap-content (se borrarían al regenerar)
 */
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

let tiptapCss = "";
try {
  tiptapCss = readFileSync(resolve(ROOT, "src/app/tiptap-content.css"), "utf-8");
} catch {
  errors.push("Falta src/app/tiptap-content.css (estilos de artículos del CMS).");
}
if (tiptapCss && !tiptapCss.includes(".tiptap-content")) {
  errors.push("src/app/tiptap-content.css ya no define la clase .tiptap-content.");
}

const layout = readFileSync(resolve(ROOT, "src/app/layout.tsx"), "utf-8");
if (!layout.includes("tiptap-content.css")) {
  errors.push("src/app/layout.tsx ya no importa ./tiptap-content.css.");
}

const globals = readFileSync(resolve(ROOT, "src/app/globals.css"), "utf-8");
if (globals.includes(".tiptap-content")) {
  errors.push(
    "globals.css contiene reglas .tiptap-content: muévelas a src/app/tiptap-content.css, " +
      "globals.css es generado y se sobrescribe en cada `npm run dev`."
  );
}

if (errors.length > 0) {
  console.error("\n[check-article-styles] Los estilos de los artículos están en riesgo:\n");
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nVer AGENTS.md (sección 'Estilos: reglas críticas').\n");
  process.exit(1);
}

console.log("[check-article-styles] ✓ estilos de artículos protegidos");
