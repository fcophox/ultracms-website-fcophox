import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enviarFormulario, KontororuError } from "@/utils/kontororu";

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_12345');

/**
 * Cada tipo de formulario entra como un `formKey` distinto, que en la bandeja
 * del complemento Contactos es una pestaña propia. No hay que declararlos en
 * ninguna parte: el primer envío da de alta el tipo.
 */
const FORM_KEYS: Record<string, string> = {
  message: "contacto",
  meeting: "agenda",
  consulting: "consultoria",
};

const ASUNTOS: Record<string, string> = {
  message: "Nuevo mensaje de contacto",
  meeting: "Nueva solicitud de reunión",
  consulting: "Nueva solicitud de consultoría UX",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, messageType, message, payload, sourceUrl } = body;

    if (!name || !email || !messageType || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const formKey = FORM_KEYS[messageType];
    if (!formKey) {
      return NextResponse.json(
        { error: `Tipo de formulario desconocido: ${messageType}` },
        { status: 400 }
      );
    }

    // 1. Registrar en la bandeja de Kontorōru
    let registro;
    try {
      registro = await enviarFormulario(formKey, {
        name,
        email,
        message,
        /*
         * De dónde salió el envío. Es lo que distingue en la bandeja un lead
         * de /resources de uno de /contact cuando ambos usan el mismo formulario.
         */
        sourceUrl: sourceUrl || request.headers.get("referer") || undefined,
        payload: { messageType, ...(payload ?? {}) },
      });
    } catch (error) {
      /*
       * Un 404 aquí no es una ruta inexistente: es el complemento Contactos
       * desactivado en el espacio. Se registra distinto porque la solución es
       * ir al panel, no revisar el código.
       */
      if (error instanceof KontororuError && error.status === 404) {
        console.error("El complemento Contactos no está activo en Kontorōru.");
      } else {
        console.error("Error al registrar el envío en Kontorōru:", error);
      }
      return NextResponse.json(
        { error: "Error al guardar el mensaje" },
        { status: 500 }
      );
    }

    // 2. Avisar por correo
    const { error: emailError } = await resend.emails.send({
      from: "Web <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "fcojhormazabalh@gmail.com"],
      subject: `[Web] ${ASUNTOS[messageType]} - ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nTipo: ${messageType}\n\nMensaje:\n${message}`,
    });

    /*
     * Un fallo de correo no invalida el envío: ya está guardado en la bandeja,
     * así que no se pierde. Se registra y se devuelve éxito.
     */
    if (emailError) {
      console.error("Resend error:", emailError);
    }

    return NextResponse.json({ success: true, data: registro.data });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
