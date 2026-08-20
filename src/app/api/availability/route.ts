import { NextResponse } from "next/server";
import { kontororu } from "@/utils/kontororu";

/**
 * GET /api/availability
 *
 * Puente entre el formulario de agenda —que es un componente de cliente— y el
 * complemento Calendario de Kontorōru. Existe porque la API Key es secreta y
 * no puede viajar en el bundle del navegador.
 *
 * Antes esto lo resolvía el propio componente leyendo `availability_settings`
 * de Supabase con la anon key, que sí podía ir en el cliente.
 */
export async function GET() {
  try {
    const disponibilidad = await kontororu.availability();

    /*
     * `null` = complemento desactivado (la API responde 404). Se distingue del
     * error para que la web pueda esconder la sección de agenda en vez de
     * quedarse pidiendo algo que ya no existe.
     */
    if (!disponibilidad) {
      return NextResponse.json(
        { data: null, reason: "addon_disabled" },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=30, must-revalidate" } },
      );
    }

    return NextResponse.json(
      { data: disponibilidad },
      {
        status: 200,
        /*
         * Misma ventana que la cabecera del CMS. El webhook `addon.updated`
         * invalida la etiqueta `availability` en cuanto el horario cambia, así
         * que estos 30 s sólo cubren el hueco hasta que llegue el aviso.
         */
        headers: { "Cache-Control": "public, s-maxage=30, must-revalidate" },
      },
    );
  } catch (error) {
    console.error("GET /api/availability", error);
    return NextResponse.json(
      { error: "No se pudo leer la disponibilidad." },
      { status: 502 },
    );
  }
}
