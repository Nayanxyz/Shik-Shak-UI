import katex from 'katex';

export function renderMathInHtml(html: string): string {
  // Replace inline math: $...$
  let processed = html.replace(/\$([^$]+)\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: false });
    } catch {
      return `$${tex}$`;
    }
  });

  // Replace display math: $$...$$
  processed = processed.replace(/\$\$([^$]+)\$\$/g, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), { throwOnError: false, displayMode: true });
    } catch {
      return `$$${tex}$$`;
    }
  });

  return processed;
}