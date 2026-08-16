import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useMemo } from 'react';

export default function MathHtml({ html, className }: { html: string; className?: string }) {
  const processed = useMemo(() => {
    if (!html) return '';

    let result = html;

    // 1. Clean up common database text corruption & HTML entities
    result = result
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\\eqalign\s*\{([\s\S]*?)\}/g, (_, inner) => `$$\\begin{aligned}${inner}\\end{aligned}$$`)
      .replace(/\\matrix\s*\{([\s\S]*?)\}/g, (_, inner) => `\\begin{matrix}${inner}\\end{matrix}`)
      .replace(/\\cr/g, '\\\\');

    // 2. Convert standard LaTeX bracket delimiters \( \) and \[ \] to $ and $$
    result = result
      .replace(/\\\[([\s\S]*?)\\\]/g, (_, tex) => `$$${tex}$$`)
      .replace(/\\\(([\s\S]*?)\\\)/g, (_, tex) => `$${tex}$`);

    // 3. Process Display Math ($$...$$)
    result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
      try { 
        return `<div class="my-2 text-center overflow-x-auto">${katex.renderToString(tex.trim(), { throwOnError: false, displayMode: true })}</div>`; 
      }
      catch { return `$$${tex}$$`; }
    });

    // 4. Process Inline Math ($...$)
    result = result.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
      try { 
        return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: false }); 
      }
      catch { return `$${tex}$`; }
    });

    return result;
  }, [html]);

  return <div className={`math-container ${className || ''}`} dangerouslySetInnerHTML={{ __html: processed }} />;
}