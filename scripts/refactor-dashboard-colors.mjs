import fs from 'fs';
import path from 'path';

function replaceColorsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Backgrounds
  content = content.replace(/bg-\[#050505\]/g, 'bg-background');
  content = content.replace(/bg-\[#0a0a0b\]/g, 'bg-surface');
  content = content.replace(/bg-\[#0b0b0c\]/g, 'bg-surface');
  content = content.replace(/bg-\[#0c0c0d\]/g, 'bg-surface');
  content = content.replace(/bg-\[#18181b\]/g, 'bg-surface/50');
  content = content.replace(/bg-\[#080808\]/g, 'bg-background');
  
  // Zinc backgrounds
  content = content.replace(/bg-zinc-900\/80/g, 'bg-surface/80');
  content = content.replace(/bg-zinc-900\/30/g, 'bg-surface/30');
  content = content.replace(/bg-zinc-900/g, 'bg-surface');
  content = content.replace(/bg-zinc-800\/50/g, 'hover:bg-muted/10'); // This could be risky but let's see context
  content = content.replace(/hover:bg-zinc-800\/30/g, 'hover:bg-muted/10');
  content = content.replace(/hover:bg-zinc-800\/50/g, 'hover:bg-muted/20');
  content = content.replace(/hover:bg-zinc-800/g, 'hover:bg-muted/20');
  content = content.replace(/bg-zinc-800/g, 'bg-muted/20');

  // Text colors
  content = content.replace(/text-white/g, 'text-foreground');
  content = content.replace(/text-black/g, 'text-background'); // buttons with white bg and black text -> bg-foreground text-background
  content = content.replace(/text-zinc-200/g, 'text-foreground/90');
  content = content.replace(/text-zinc-300/g, 'text-foreground/80');
  content = content.replace(/text-zinc-400/g, 'text-muted');
  content = content.replace(/text-zinc-500/g, 'text-muted/80');
  content = content.replace(/text-zinc-600/g, 'text-muted/60');
  
  // Hover Text
  content = content.replace(/hover:text-white/g, 'hover:text-foreground');
  
  // Borders
  content = content.replace(/border-transparent/g, 'border-transparent');
  content = content.replace(/border-zinc-800\/80/g, 'border-border/80');
  content = content.replace(/border-zinc-800\/60/g, 'border-border/60');
  content = content.replace(/border-zinc-800\/50/g, 'border-border/50');
  content = content.replace(/border-zinc-800/g, 'border-border');
  content = content.replace(/border-zinc-700/g, 'border-border');
  
  // Placeholders
  content = content.replace(/placeholder:text-zinc-700/g, 'placeholder:text-muted/50');
  content = content.replace(/placeholder:text-zinc-600/g, 'placeholder:text-muted/60');
  
  // Specific Button text
  content = content.replace(/bg-white text-background/g, 'bg-foreground text-background'); // From bg-white text-black
  content = content.replace(/bg-white/g, 'bg-foreground'); 
  content = content.replace(/hover:bg-zinc-200/g, 'hover:bg-foreground/90');
  
  fs.writeFileSync(filePath, content, 'utf-8');
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceColorsInFile(fullPath);
      console.log('Processed:', fullPath);
    }
  }
}

processDirectory(path.join(process.cwd(), 'src/app/dashboard'));
