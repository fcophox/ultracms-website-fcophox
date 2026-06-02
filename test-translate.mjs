import translate from 'google-translate-api-x';
import * as parse5 from 'parse5';

function traverseAndExtractTextNodes(node, textNodesArray) {
  if (node.nodeName === '#text') {
    const originalText = node.value || "";
    if (/\S/.test(originalText)) {
      const match = originalText.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (match) {
        textNodesArray.push({
          node,
          originalText,
          coreText: match[2],
          leadingSpace: match[1],
          trailingSpace: match[3]
        });
      }
    }
  }
  if (node.childNodes && node.childNodes.length > 0) {
    for (const child of node.childNodes) {
      traverseAndExtractTextNodes(child, textNodesArray);
    }
  }
}

async function test() {
  const html = '<p>Hola <strong>mundo</strong> genial</p>';
  const ast = parse5.parseFragment(html);
  const textNodesInfo = [];
  traverseAndExtractTextNodes(ast, textNodesInfo);
  
  const textsToTranslate = textNodesInfo.map(info => info.coreText);
  const translations = await translate(textsToTranslate, { to: 'en' });
  const translatedArray = Array.isArray(translations) ? translations.map(t => t.text) : [translations.text];
  
  textNodesInfo.forEach((info, index) => {
    const translatedCoreText = translatedArray[index] || info.coreText;
    info.node.value = `${info.leadingSpace}${translatedCoreText}${info.trailingSpace}`;
  });
  
  console.log("Original:", html);
  console.log("Translated:", parse5.serialize(ast));
}
test();
