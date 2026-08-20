import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { CATEGORIA } from "@/utils/kontororu";

/**
 * Webhook de Kontorōru. Se configura en Ajustes → Webhooks apuntando a
 * `https://<dominio>/api/revalidate/kontororu`.
 *
 * Debe ser el host que responde 200 directo, sin redirección: un ápex que
 * hace 307 hacia `www` pierde la entrega en el salto y el panel la registra
 * como fallida.
 *
 * Eventos que espera: post.published, post.updated, post.deleted y
 * addon.updated.
 */
export const runtime = "nodejs"; // node:crypto no existe en el runtime edge

/**
 * Toda entrega rechazada deja rastro.
 *
 * El CMS reintenta con espera creciente y desde fuera no hay forma de saber
 * cuál de las tres puertas —cabeceras, antigüedad, firma— cerró: devolver
 * texto plano sin registrar nada deja el intento fallido invisible en Vercel.
 * `evento` sale de la cabecera y no del cuerpo, porque el cuerpo todavía no
 * está verificado.
 */
function rechazar(req: Request, motivo: string, status: number, detalle?: unknown) {
  console.warn(
    `[kontororu-webhook] rechazado: ${motivo}`,
    JSON.stringify({
      evento: req.headers.get("x-kontororu-event"),
      agente: req.headers.get("user-agent"),
      ...(detalle ? { detalle } : {}),
    }),
  );
  return new Response(motivo, { status });
}

export async function POST(req: Request) {
  // Texto crudo, no JSON: el HMAC se calcula sobre el cuerpo tal cual llegó.
  const body = await req.text();
  const ts = req.headers.get("x-kontororu-timestamp");
  const sig = req.headers.get("x-kontororu-signature");

  if (!ts || !sig) {
    return rechazar(req, "Missing headers", 401, {
      timestamp: ts ? "presente" : "ausente",
      firma: sig ? "presente" : "ausente",
    });
  }

  // El timestamp entra en el HMAC precisamente para poder rechazar reenvíos.
  const desfase = Date.now() / 1000 - Number(ts);
  if (!Number.isFinite(desfase) || Math.abs(desfase) > 300) {
    return rechazar(req, "Stale timestamp", 401, { desfaseSegundos: Math.round(desfase) });
  }

  const secret = process.env.KONTORORU_WEBHOOK_SECRET;
  if (!secret) {
    console.error("KONTORORU_WEBHOOK_SECRET no está configurado.");
    return new Response("Configuration error", { status: 500 });
  }

  const esperada = `sha256=${createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex")}`;

  /*
   * La comparación es en tiempo constante, pero `timingSafeEqual` lanza si los
   * buffers miden distinto: hay que comprobar la longitud antes.
   */
  if (
    sig.length !== esperada.length ||
    !timingSafeEqual(Buffer.from(sig), Buffer.from(esperada))
  ) {
    return rechazar(req, "Bad signature", 401);
  }

  let evento: string;
  let data: { slug?: string; previousSlug?: string; addon?: string; isEnabled?: boolean };
  try {
    ({ event: evento, data } = JSON.parse(body));
  } catch {
    return rechazar(req, "Body is not JSON", 400);
  }

  const revalidadas: string[] = [];

  /*
   * `revalidateTag` de esta versión de Next pide un perfil como segundo
   * argumento; la forma de un solo argumento está deprecada. Se usa "max", que
   * marca la etiqueta como obsoleta con semántica stale-while-revalidate.
   *
   * `updateTag`, que expira en el acto, NO sirve aquí: sólo puede llamarse
   * desde Server Actions, no desde un Route Handler.
   *
   * Consecuencia a tener presente: tras un `post.deleted`, la primera visita
   * todavía recibe la versión cacheada y la siguiente ya no. Para un blog es
   * aceptable; `revalidate = 3600` en las páginas es la red de seguridad.
   */
  const marcar = (tag: string) => {
    revalidateTag(tag, "max");
    revalidadas.push(tag);
  };

  /*
   * Idempotente a propósito: un reintento tras un timeout en el que la entrega
   * sí llegó reenvía el mismo evento. Revalidar dos veces no cuesta nada; por
   * eso aquí no se manda correo ni se procesa nada con efectos.
   */
  switch (evento) {
    case "post.published":
    case "post.updated":
    case "post.deleted": {
      marcar("posts");
      // Ambos listados: el webhook no dice de qué categoría era la entrada.
      marcar(`posts:${CATEGORIA.blog}`);
      marcar(`posts:${CATEGORIA.casosDeEstudio}`);

      if (data?.slug) marcar(`post:${data.slug}`);

      /*
       * Sin invalidar también el slug anterior, la página vieja se queda
       * publicada en la web para siempre.
       */
      if (data?.previousSlug) marcar(`post:${data.previousSlug}`);
      break;
    }

    case "addon.updated": {
      /*
       * El payload no trae la configuración, igual que el de contenido no trae
       * el cuerpo del artículo: es un aviso de "esto cambió, vuelve a pedirlo".
       */
      if (data?.addon === "calendar") marcar("availability");
      break;
    }

    default:
      // Un evento que no nos interesa no es un fallo: 200 y no se reintenta.
      console.info(`[kontororu-webhook] evento ignorado: ${evento}`);
      return Response.json({ ignored: evento });
  }

  console.info(`[kontororu-webhook] ${evento} → ${revalidadas.join(", ") || "nada"}`);
  return Response.json({ revalidated: revalidadas });
}
