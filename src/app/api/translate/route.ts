import { NextResponse } from 'next/server';
import translate from 'google-translate-api-x';
import * as parse5 from 'parse5';

// Helper for slug generation
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9]+/g, "-")     // replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, "");        // trim hyphens
}

interface TextNodeInfo {
  node: any;
  originalText: string;
  coreText: string;
  leadingSpace: string;
  trailingSpace: string;
}

function traverseAndExtractTextNodes(node: any, textNodesArray: TextNodeInfo[]) {
  if (node.nodeName === '#text') {
    const originalText = node.value || "";
    // Only process if it has non-whitespace characters
    if (/\S/.test(originalText)) {
      const match = originalText.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (match) {
        const leadingSpace = match[1];
        const coreText = match[2];
        const trailingSpace = match[3];

        textNodesArray.push({
          node,
          originalText,
          coreText,
          leadingSpace,
          trailingSpace
        });
      }
    }
  }

  // Recurse for child nodes
  if (node.childNodes && node.childNodes.length > 0) {
    for (const child of node.childNodes) {
      traverseAndExtractTextNodes(child, textNodesArray);
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = body;

    if (!title && !content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    let translatedTitle = "";
    let slug = "";
    let translatedHtml = content || "";

    // 1. Translate Title
    if (title) {
      const titleRes = await translate(title, { to: 'en' });
      translatedTitle = (titleRes as any).text;
      slug = generateSlug(translatedTitle);
    }

    // 2. Translate Content (HTML)
    if (content) {
      // Parse HTML to AST
      const ast = parse5.parseFragment(content);
      
      const textNodesInfo: TextNodeInfo[] = [];
      traverseAndExtractTextNodes(ast, textNodesInfo);

      if (textNodesInfo.length > 0) {
        const textsToTranslate = textNodesInfo.map(info => info.coreText);

        // Batch translation
        const translations = await translate(textsToTranslate, { to: 'en' });
        
        // Reconstruct AST with translated texts
        const translatedArray = Array.isArray(translations) ? translations.map((t: any) => t.text) : [(translations as any).text];

        textNodesInfo.forEach((info, index) => {
          const translatedCoreText = translatedArray[index] || info.coreText;
          info.node.value = `${info.leadingSpace}${translatedCoreText}${info.trailingSpace}`;
        });
      }

      // Serialize AST back to HTML string
      translatedHtml = parse5.serialize(ast);
    }

    return NextResponse.json({
      title: translatedTitle,
      slug,
      content: translatedHtml
    });

  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
