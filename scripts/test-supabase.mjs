import { createClient } from "@supabase/supabase-js";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const envFile = readFileSync(resolve(ROOT, ".env.local"), "utf-8");
const envConfig = {};
envFile.split("\n").forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    envConfig[key] = val;
  }
});
const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Testing Supabase connectivity...");
  
  // Try to query posts
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .limit(1);
    
  if (postsError) {
    console.error("Error fetching posts:", postsError);
  } else {
    console.log("Found posts table. Row keys:", posts.length > 0 ? Object.keys(posts[0]) : "Empty table");
  }

  // Try to query articles
  const { data: articles, error: articlesError } = await supabase
    .from("articles")
    .select("*")
    .limit(1);
    
  if (articlesError) {
    console.log("Error fetching articles:", articlesError.message);
  } else {
    console.log("Found articles table. Row keys:", articles.length > 0 ? Object.keys(articles[0]) : "Empty table");
    if (articles.length > 0) {
      console.log("Sample article title:", articles[0].title);
    }
  }

  // Try to query case_studies
  const { data: caseStudies, error: csError } = await supabase
    .from("case_studies")
    .select("*")
    .limit(1);
    
  if (csError) {
    console.error("Error fetching case_studies:", csError);
  } else {
    console.log("Found case_studies table. Row keys:", caseStudies.length > 0 ? Object.keys(caseStudies[0]) : "Empty table");
    if (caseStudies.length > 0) {
      console.log("Sample case study title:", caseStudies[0].title);
    }
  }
}

test();
