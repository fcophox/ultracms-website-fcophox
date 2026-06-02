import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, messageType, message } = body;

    if (!name || !email || !messageType || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // 1. Insert into Supabase
    const supabase = await createClient();
    const { data: insertData, error: insertError } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          message_type: messageType,
          message,
          status: "new",
          is_archived: false,
        },
      ])
      .select();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Error al guardar el mensaje" },
        { status: 500 }
      );
    }

    // 2. Send email via Resend
    let subject = "Nuevo mensaje de contacto";
    if (messageType === "meeting") subject = "Nueva solicitud de reunión";
    if (messageType === "consulting") subject = "Nueva solicitud de consultoría UX";

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Web <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "fcojhormazabalh@gmail.com"],
      subject: `[Web] ${subject} - ${name}`,
      text: `Nombre: ${name}\nEmail: ${email}\nTipo: ${messageType}\n\nMensaje:\n${message}`,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
    }

    return NextResponse.json({ success: true, data: insertData });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
