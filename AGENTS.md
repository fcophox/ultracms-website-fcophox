<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estilos: reglas críticas

- `src/app/globals.css` es **generado** por `scripts/sync-design.mjs` a partir de `DESIGN.MD` (corre en cada `npm run dev`). Nunca lo edites a mano: cualquier cambio se pierde. Para cambiar tokens de diseño, edita `DESIGN.MD`; para cambiar la plantilla del CSS, edita `CSS_TEMPLATE` en `scripts/sync-design.mjs`.
- Los estilos de los artículos del CMS (clase `.tiptap-content`, compartida por el editor Tiptap y las páginas públicas de blog/case-studies) viven en `src/app/tiptap-content.css`, importado desde `src/app/layout.tsx`. **No los muevas a globals.css** — ahí se borran al regenerarse.
