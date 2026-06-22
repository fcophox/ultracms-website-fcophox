import { NextResponse } from "next/server";
import translate from "google-translate-api-x";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "No title provided" }, { status: 400 });
    }

    const result = await translate(title, { to: "en" });
    const translated = (result as any).text;

    return NextResponse.json({ translated });
  } catch (error) {
    console.error("Title translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
