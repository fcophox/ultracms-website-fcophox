import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  try {
    const { id, tableName } = await request.json();

    if (!id || !tableName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (tableName !== "articles" && tableName !== "case_studies") {
      return NextResponse.json({ error: "Invalid table name" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch current likes
    const { data: item, error: fetchError } = await supabase
      .from(tableName)
      .select("likes")
      .eq("id", id)
      .single();

    if (fetchError) {
      // If the column doesn't exist, it will throw an error, which is caught here.
      console.error("Error fetching likes. Make sure 'likes' column exists in", tableName, fetchError);
      return NextResponse.json({ error: "Item not found or schema mismatch" }, { status: 404 });
    }

    const currentLikes = item.likes || 0;

    // Update with incremented likes
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ likes: currentLikes + 1 })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating likes:", updateError);
      return NextResponse.json({ error: "Error updating likes" }, { status: 500 });
    }

    return NextResponse.json({ success: true, likes: currentLikes + 1 });
  } catch (error) {
    console.error("Like API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
