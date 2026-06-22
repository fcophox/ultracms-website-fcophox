/**
 * Generates a URL-friendly slug from a string.
 * Removes diacritics, lowercases, and replaces non-alphanumerics with hyphens.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics (accents)
    .replace(/[^a-z0-9]+/g, "-")    // replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, "");       // trim leading/trailing hyphens
}

/**
 * Translates a title to English using the /api/translate-title endpoint,
 * then generates a slug from the translated text.
 * Falls back to slugifying the original title if translation fails.
 */
export async function generateEnglishSlug(title: string): Promise<string> {
  try {
    const res = await fetch("/api/translate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error("Translation failed");

    const data = await res.json();
    return generateSlug(data.translated || title);
  } catch {
    // Fallback: just slugify the original title
    return generateSlug(title);
  }
}
