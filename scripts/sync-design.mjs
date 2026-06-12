import { readFileSync, writeFileSync, watchFile } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DESIGN_MD = resolve(ROOT, "DESIGN.MD");
const GLOBALS_CSS = resolve(ROOT, "src/app/globals.css");

const CSS_TEMPLATE = `/*
 * ARCHIVO GENERADO por scripts/sync-design.mjs a partir de DESIGN.MD.
 * NO editar a mano: cualquier cambio se sobrescribe en el siguiente \`npm run dev\`.
 * Tokens de diseño -> editar DESIGN.MD.
 * Estilos de artículos (Tiptap/CMS) -> src/app/tiptap-content.css.
 */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-secondary: var(--secondary);
  --color-accent: var(--accent);
  --color-muted: var(--muted);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --font-sans: var(--font-sans);
  --font-mono: var(--font-geist-mono);
}

:root {
  --background: %colors.background.light%;
  --foreground: %colors.foreground.light%;
  --primary: %colors.primary.light%;
  --secondary: %colors.secondary.light%;
  --accent: %colors.accent.light%;
  --muted: %colors.muted.light%;
  --surface: %colors.surface.light%;
  --border: %colors.border.light%;
}

.dark {
  --background: %colors.background.dark%;
  --foreground: %colors.foreground.dark%;
  --primary: %colors.primary.dark%;
  --secondary: %colors.secondary.dark%;
  --accent: %colors.accent.dark%;
  --muted: %colors.muted.dark%;
  --surface: %colors.surface.dark%;
  --border: %colors.border.dark%;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
  transition: background-color 0.3s ease, color 0.3s ease;
}
`;

function parseTokens(text) {
  const tokens = {};
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("//")) continue;
    const sep = trimmed.indexOf(": ");
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    const raw = trimmed.slice(sep + 2).trim();
    const value = raw.startsWith('"') && raw.endsWith('"') ? raw.slice(1, -1) : raw;
    const parts = key.split(".");
    let obj = tokens;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!obj[parts[i]]) obj[parts[i]] = {};
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
  }
  return tokens;
}

function resolvePath(obj, path) {
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function applyTemplate(template, tokens) {
  return template.replace(/%([^%]+)%/g, (match, path) => {
    const value = resolvePath(tokens, path);
    if (value === undefined) {
      console.warn(`[design] WARNING: token "${path}" not found in DESIGN.MD`);
      return match;
    }
    return value;
  });
}

function extractTokenBlock(content) {
  const startMarker = "---tokens";
  const endMarker = "---";
  const start = content.indexOf(startMarker);
  if (start === -1) return null;
  const afterStart = start + startMarker.length;
  const end = content.indexOf(endMarker, afterStart);
  if (end === -1) return null;
  return content.slice(afterStart, end).trim();
}

function sync() {
  try {
    const md = readFileSync(DESIGN_MD, "utf-8");
    const block = extractTokenBlock(md);
    if (!block) {
      console.error("[design] ERROR: no `---tokens` block found in DESIGN.MD");
      return;
    }
    const tokens = parseTokens(block);
    const css = applyTemplate(CSS_TEMPLATE, tokens);
    writeFileSync(GLOBALS_CSS, css, "utf-8");
    console.log(`[design] ✓ globals.css generated from DESIGN.MD (${new Date().toLocaleTimeString()})`);
  } catch (err) {
    console.error("[design] ERROR:", err.message);
  }
}

sync();

watchFile(DESIGN_MD, { interval: 500 }, (curr, prev) => {
  if (curr.mtimeMs !== prev.mtimeMs) {
    sync();
  }
});

console.log(`[design] Watching DESIGN.MD for changes (polling every 500ms)...`);
