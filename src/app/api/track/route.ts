import { NextResponse } from "next/server";
import { enviarFormulario } from "@/utils/kontororu";

/**
 * POST /api/track
 *
 * Registra los dos eventos de `/resources` —desbloqueo de recursos y copia de
 * un prompt— en la bandeja de Kontorōru.
 *
 * Existe como ruta propia porque antes esos componentes escribían en Supabase
 * directamente desde el navegador con la anon key. La clave de Kontorōru es
 * secreta, así que el envío tiene que salir del servidor.
 *
 * Cada evento usa su propio `formKey`, de modo que la bandeja los separa en
 * pestañas y no se mezclan con los contactos reales.
 *
 * NOTA: estos dos no son leads —llevan correos de relleno y GA4 ya registra
 * ambos con `sendGAEvent`—. Se migran para dejar de escribir en Supabase, no
 * porque la bandeja sea su sitio natural.
 */
const EVENTOS: Record<string, { formKey: string; name: string; email: string }> = {
  resource_unlock: {
    formKey: "recursos",
    name: "Resource Unlock",
    email: "unlock@fcophox.com",
  },
  prompt_copy: {
    formKey: "biblioteca-prompts",
    name: "Prompt Copy",
    email: "copy@fcophox.com",
  },
};

export async function POST(request: Request) {
  try {
    const { event, message, payload } = await request.json();

    const config = EVENTOS[event];
    if (!config) {
      return NextResponse.json({ error: "Evento desconocido" }, { status: 400 });
    }

    await enviarFormulario(config.formKey, {
      name: config.name,
      email: config.email,
      message: typeof message === "string" ? message : config.name,
      sourceUrl: request.headers.get("referer") || undefined,
      payload: payload ?? {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    /*
     * Es telemetría: si falla, no debe romper la interacción del usuario. Se
     * registra y se devuelve 200 — el componente que llama tampoco reacciona
     * al resultado.
     */
    console.error("POST /api/track", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
